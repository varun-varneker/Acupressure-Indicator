import React, { useRef, useEffect } from 'react';

export default function Sidebar({ point, onRelatedClick }) {
  const detailsRef = useRef(null);

  useEffect(() => {
    if (detailsRef.current) {
      detailsRef.current.scrollTop = 0;
    }
  }, [point]);

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

  if (!point) {
    return (
      <div className="info-panel">
        <h2>Point Details</h2>
        <div id="details">
          <div className="empty-state">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <p>Select or hover over a pressure point to explore its details, technique, and benefits.</p>
          </div>
        </div>
      </div>
    );
  }

  const color = getElementColor(point.element);

  return (
    <div className="info-panel">
      <h2>Point Details</h2>
      <div id="details" ref={detailsRef}>
        <div className="point-details">
          <div className="detail-header">
            <div>
              <h3>{point.name}</h3>
              <span className="point-code" style={{ background: color.fill }}>{point.code}</span>
              <span className="chinese-name">{point.ChineseName} <em>{point.pinyin}</em></span>
            </div>
            <div className="element-badge" style={{ 
              background: `${color.fill}20`, 
              color: color.fill, 
              borderColor: `${color.fill}40` 
            }}>
              {point.element} · {point.yinYang}
            </div>
          </div>

          <p className="meridian-line">🔗 {point.meridian} Meridian &nbsp;·&nbsp; {point.bodyRegion}</p>
          <p className="anatomical">{point.anatomicalLocation}</p>

          {point.symptoms?.length > 0 && (
            <div className="section">
              <strong>Symptoms</strong>
              <div className="badge-group">
                {point.symptoms.map(s => <span key={s} className="badge">{s}</span>)}
              </div>
            </div>
          )}

          {point.modernUses?.length > 0 && (
            <div className="section">
              <strong>Modern Uses</strong>
              <div className="badge-group">
                {point.modernUses.map(m => <span key={m} className="badge badge-modern">{m}</span>)}
              </div>
            </div>
          )}

          {point.benefits?.length > 0 && (
            <div className="section">
              <strong>Benefits</strong>
              <ul>
                {point.benefits.map(b => <li key={b}>{b}</li>)}
              </ul>
            </div>
          )}

          {point.indications?.length > 0 && (
            <div className="section">
              <strong>Indications</strong>
              <ul>
                {point.indications.map(i => <li key={i}>{i}</li>)}
              </ul>
            </div>
          )}

          {point.pressureTechnique?.method && (
            <div className="section technique-box">
              <strong>🤲 Pressure Technique</strong>
              <div className="technique-grid">
                <div><span className="tech-label">Method</span>{point.pressureTechnique.method}</div>
                <div><span className="tech-label">Duration</span>{point.pressureTechnique.duration || '—'}</div>
                <div><span className="tech-label">Intensity</span>{point.pressureTechnique.intensity || '—'}</div>
                <div><span className="tech-label">Frequency</span>{point.pressureTechnique.frequency || '—'}</div>
              </div>
            </div>
          )}

          {point.contraindications?.length > 0 && (
            <div className="section caution-box">
              <strong>⚠️ Cautions</strong>
              <ul>
                {point.contraindications.map(c => <li key={c} className="caution-item">{c}</li>)}
              </ul>
            </div>
          )}

          {point.relatedPoints?.length > 0 && (
            <div className="section">
              <strong>Related Points</strong>
              <div className="badge-group">
                {point.relatedPoints.map(r => (
                  <span 
                    key={r} 
                    className="badge badge-related" 
                    onClick={() => onRelatedClick(r)}
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}

          {point.video && (
            <iframe 
              src={point.video} 
              allowFullScreen 
              loading="lazy" 
              title={`${point.name} technique`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
