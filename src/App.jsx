import React, { useState, useEffect, useMemo } from 'react';
import { acupuncturePoints as points } from './data/points';
import BodyMap from './components/BodyMap';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';

export default function App() {
  const [currentSide, setCurrentSide] = useState('front');
  const [activePoint, setActivePoint] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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
      const source = p.coordinates.svgSource;
      const targetSource = `body-map-${currentSide}.svg`;
      return source === targetSource;
    });
  }, [filteredPoints, currentSide]);

  const handlePointSelect = (point) => {
    setActivePoint(point);
  };

  const handleSwitchSide = (side) => {
    if (currentSide === side) return;
    setCurrentSide(side);
    if (activePoint) {
      if (activePoint.coordinates.svgSource !== `body-map-${side}.svg`) {
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
            const side = target.coordinates.svgSource.includes('back') ? 'back' : 'front';
            if (side !== currentSide) {
              handleSwitchSide(side);
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
