import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

export default function BodyMap({ side, points, activePoint, onPointSelect, onBackgroundClick }) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const zoomLayerRef = useRef(null);
  const d3ZoomRef = useRef(null);
  const [svgContent, setSvgContent] = useState(null);
  const [viewBox, setViewBox] = useState('0 0 1127 2286');

  // Load SVG
  useEffect(() => {
    const file = `/body-map-${side}.svg`;
    fetch(file)
      .then(res => res.text())
      .then(text => {
        // Extract viewBox if exists
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "image/svg+xml");
        const svgEl = doc.querySelector('svg');
        if (svgEl) {
          const vb = svgEl.getAttribute('viewBox') || '0 0 1127 2286';
          setViewBox(vb);
          setSvgContent(svgEl.innerHTML);
        }
      });
  }, [side]);

  // Set up D3 Zoom
  useEffect(() => {
    if (!svgRef.current || !zoomLayerRef.current) return;

    const svg = d3.select(svgRef.current);
    const zoomLayer = d3.select(zoomLayerRef.current);
    const [origX, origY, origW, origH] = viewBox.split(/[\s,]+/).map(Number);

    const zoom = d3.zoom()
      .scaleExtent([1, 6])
      .translateExtent([[0, 0], [origW, origH]])
      .on("zoom", (event) => {
        zoomLayer.attr("transform", event.transform);
      });

    svg.call(zoom);
    d3ZoomRef.current = { zoom, svg };

    // Initial transform
    svg.call(zoom.transform, d3.zoomIdentity);

  }, [svgContent, viewBox]);

  // Centering logic
  useEffect(() => {
    if (!activePoint || !d3ZoomRef.current) {
      if (d3ZoomRef.current) {
        d3ZoomRef.current.svg.transition().duration(750)
          .call(d3ZoomRef.current.zoom.transform, d3.zoomIdentity);
      }
      return;
    }

    const [origX, origY, origW, origH] = viewBox.split(/[\s,]+/).map(Number);
    const coords = activePoint.coordinates; 
    // Note: in points.js coordinates are already x/y percentages.
    
    const targetX = (coords.x / 100) * origW;
    const targetY = (coords.y / 100) * origH;
    
    const scale = 3.5;
    const translateX = (origW / 2) - targetX * scale;
    const translateY = (origH / 2) - targetY * scale;

    const transform = d3.zoomIdentity
      .translate(translateX, translateY)
      .scale(scale);

    d3ZoomRef.current.svg.transition().duration(750)
      .call(d3ZoomRef.current.zoom.transform, transform);

  }, [activePoint, viewBox]);

  const getElementColor = (element) => {
    const colors = {
      'Fire':   { fill: '#ff6b81', glow: '#ff6b81' },
      'Wood':   { fill: '#2ecc71', glow: '#2ecc71' },
      'Earth':  { fill: '#f1c40f', glow: '#f1c40f' },
      'Metal':  { fill: '#ecf0f1', glow: '#bdc3c7' },
      'Water':  { fill: '#3498db', glow: '#3498db' },
      'Default': { fill: '#ff6b81', glow: '#ff6b81' }
    };
    return colors[element] || colors['Default'];
  };

  const [origX, origY, origW, origH] = viewBox.split(/[\s,]+/).map(Number);
  const r = Math.min(origW, origH) * 0.012;
  const rHover = r * 1.5;
  const rGlow = r * 2.5;
  const rGlowHover = r * 3.2;

  return (
    <div className="body-container" ref={containerRef}>
      <div id="svgContainer">
        <svg 
          ref={svgRef}
          viewBox={viewBox} 
          onClick={(e) => {
            if (e.target.tagName !== 'circle') {
              onBackgroundClick();
            }
          }}
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <g className="zoom-layer" ref={zoomLayerRef}>
            {/* The SVG structure itself */}
            <g dangerouslySetInnerHTML={{ __html: svgContent }} />
            
            {/* Acupoints layer */}
            <g id="acupoints-layer">
              {points.map(p => {
                const cx = (p.coordinates.x / 100) * origW;
                const cy = (p.coordinates.y / 100) * origH;
                const color = getElementColor(p.element);
                const isActive = activePoint?.id === p.id;

                return (
                  <g key={p.id} onClick={(e) => { e.stopPropagation(); onPointSelect(p); }} style={{ cursor: 'pointer' }}>
                    <circle 
                      cx={cx} cy={cy} 
                      r={isActive ? rGlowHover : rGlow} 
                      fill={color.glow} 
                      opacity={isActive ? "0.6" : "0.3"}
                      className="point-glow"
                    />
                    <circle 
                      cx={cx} cy={cy} 
                      r={isActive ? rHover : r} 
                      fill={color.fill} 
                      stroke="#fff" 
                      strokeWidth="2"
                      className={`point ${isActive ? 'active' : ''}`}
                    />
                    <text
                      x={cx + r + 4}
                      y={cy + 3}
                      fontSize={Math.max(r * 1.4, 8)}
                      fill="#e2e8f0"
                      fontFamily="Inter, sans-serif"
                      fontWeight="600"
                      pointerEvents="none"
                      className="point-label"
                      paintOrder="stroke"
                      stroke="rgba(0,0,0,0.6)"
                      strokeWidth="3"
                    >
                      {p.code || p.id}
                    </text>
                  </g>
                );
              })}
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
