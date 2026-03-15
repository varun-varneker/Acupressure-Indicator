import React, { useState, useEffect, useMemo } from 'react';
import { points } from './data/points';
import BodyMap from './components/BodyMap';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';

export default function App() {
  const [currentSide, setCurrentSide] = useState('front');
  const [activePoint, setActivePoint] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Service Worker registration
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('SW registered: ', registration);
        }).catch(err => {
          console.log('SW registration failed: ', err);
        });
      });
    }
  }, []);

  const filteredPoints = useMemo(() => {
    if (!searchQuery) return points;
    const query = searchQuery.toLowerCase().trim();
    return points.filter(p => {
      const text = [
        p.id, p.name, p.code, p.ChineseName, p.pinyin,
        p.meridian, p.element,
        ...(p.symptoms || []),
        ...(p.indications || []),
        ...(p.modernUses || []),
        ...(p.benefits || []),
        p.anatomicalLocation
      ].join(' ').toLowerCase();
      return text.includes(query);
    });
  }, [searchQuery]);

  const sidePoints = useMemo(() => {
    return filteredPoints.filter(p => {
      const ps = p.bodyArea === 'Both' || p.bodyArea === 'both' ? 'both' : (p.bodyArea === 'Back' || p.bodyArea === 'back' ? 'back' : 'front');
      // Simple mapping back to 'front'/'back'
      // Note: Data says "Torso", "Leg", etc. but previously we used a helper getPointSide.
      // I'll replicate the logic more robustly.
      const actualSide = getPointSide(p);
      return actualSide === 'both' || actualSide === currentSide;
    });
  }, [filteredPoints, currentSide]);

  function getPointSide(p) {
    const backPoints = ["GV20", "GV14", "BL23", "BL40", "BL60", "SI3", "TE5"];
    if (backPoints.includes(p.id)) return 'back';
    const bothPoints = ["LI4", "PC6", "ST36", "SP6", "LV3", "KD3", "GB34", "LU7", "KD1"];
    if (bothPoints.includes(p.id)) return 'both';
    return 'front';
  }

  const handlePointSelect = (point) => {
    setActivePoint(point);
  };

  const handleSwitchSide = (side) => {
    if (currentSide === side) return;
    setCurrentSide(side);
    if (activePoint) {
      const ps = getPointSide(activePoint);
      if (ps !== side && ps !== 'both') {
        setActivePoint(null);
      }
    }
  };

  return (
    <div className="app-root">
      <div className="header">
        <h1>Acupressure Body Explorer</h1>
        <p className="subtitle">Traditional Chinese Medicine — Interactive Point Map</p>
      </div>

      <div className="toggle-row">
        <div className="toggle-container">
          <button 
            className={`toggle-btn ${currentSide === 'front' ? 'active' : ''}`}
            onClick={() => handleSwitchSide('front')}
          >
            Front Body
          </button>
          <button 
            className={`toggle-btn ${currentSide === 'back' ? 'active' : ''}`}
            onClick={() => handleSwitchSide('back')}
          >
            Back Body
          </button>
        </div>
        
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        
        <span id="point-count">
          {sidePoints.length} point{sidePoints.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="container">
        <BodyMap 
          side={currentSide} 
          points={sidePoints}
          activePoint={activePoint}
          onPointSelect={handlePointSelect}
          onBackgroundClick={() => setActivePoint(null)}
        />
        <Sidebar point={activePoint} onRelatedClick={(id) => {
          const target = points.find(p => p.id === id);
          if (target) {
            const side = getPointSide(target);
            if (side !== 'both' && side !== currentSide) {
              handleSwitchSide(side);
              // Small delay to allow SVG to load?
              // In React, we can just set state.
              setActivePoint(target);
            } else {
              setActivePoint(target);
            }
          }
        }} />
      </div>
    </div>
  );
}
