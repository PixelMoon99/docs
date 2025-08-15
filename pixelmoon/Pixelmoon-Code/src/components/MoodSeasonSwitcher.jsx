// MoodSeasonSwitcher.jsx
import React, { useState, useEffect } from 'react';
import { Sun, Snowflake, CloudRain, Palette, Leaf } from 'lucide-react';
import styles from './MoodSeasonSwitcher.module.css';

const MoodSeasonSwitcher = () => {
  const [season, setSeason] = useState('normal');
  const [showMenu, setShowMenu] = useState(false);
  const [particles, setParticles] = useState([]);
  const [lightning, setLightning] = useState(false);

  const seasons = {
    normal: { name: 'Normal', icon: Palette, color: '#6b7280' },
    summer: { name: 'Summer', icon: Sun, color: '#f59e0b' },
    autumn: { name: 'Autumn', icon: Leaf, color: '#dc2626' },
    winter: { name: 'Winter', icon: Snowflake, color: '#60a5fa' },
    rain: { name: 'Rain', icon: CloudRain, color: '#475569' }
  };

  // Generate particles
  useEffect(() => {
    if (season === 'normal') {
      setParticles([]);
      return;
    }

    const newParticles = [];
    let count = season === 'winter' ? 100 : season === 'rain' ? 150 : 50;
    
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 10 + 5,
        speed: Math.random() * 3 + 1,
        opacity: Math.random() * 0.7 + 0.3
      });
    }
    setParticles(newParticles);

    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        y: particle.y > window.innerHeight ? -10 : particle.y + particle.speed
      })));
    }, 50);

    return () => clearInterval(interval);
  }, [season]);

  // Lightning effect
  useEffect(() => {
    if (season === 'rain') {
      const interval = setInterval(() => {
        if (Math.random() < 0.1) {
          setLightning(true);
          setTimeout(() => setLightning(false), 200);
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [season]);

  const selectSeason = (newSeason) => {
    setSeason(newSeason);
    setShowMenu(false);
  };



const getParticleStyle = (particle) => {
  const baseStyle = {
    position: 'fixed',
    left: `${particle.x}px`,
    top: `${particle.y}px`,
    width: `${particle.size}px`,
    height: `${particle.size}px`,
    opacity: particle.opacity,
    pointerEvents: 'none',
    zIndex: 1
  };

  switch (season) {
    case 'summer':
      return {
        ...baseStyle,
        background: 'radial-gradient(circle, #FFD700, #FFA500)',
        borderRadius: '50%',
        boxShadow: '0 0 10px rgba(255, 215, 0, 0.8)'
      };
    case 'rain':
      return {
        ...baseStyle,
        background: 'linear-gradient(to bottom, #ADD8E6, #4169E1)',
        width: '2px',
        height: `${particle.size * 3}px`,
        borderRadius: '50px'
      };
    default:
      return baseStyle;
  }
};

const getParticleElement = (particle) => {
  switch (season) {
    case 'winter':
      return (
        <svg
          key={particle.id}
          style={{
            position: 'fixed',
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            pointerEvents: 'none',
            zIndex: 1
          }}
          viewBox="0 0 24 24"
          fill="white"
        >
          <path d="M12 2L13.09 8.26L16 7L14.74 9.74L21 12L14.74 14.26L16 17L13.09 15.74L12 22L10.91 15.74L8 17L9.26 14.26L3 12L9.26 9.74L8 7L10.91 8.26L12 2Z" />
        </svg>
      );
      
    case 'autumn':
      return (
        <svg
          key={particle.id}
          style={{
            position: 'fixed',
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            pointerEvents: 'none',
            zIndex: 1,
            transform: `rotate(${particle.id * 10}deg)`
          }}
          viewBox="0 0 24 24"
          fill={['#FF4500', '#DAA520', '#8B0000'][particle.id % 3]}
        >
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,15.5C2,15.5 2,16.5 3,16.5C4,16.5 4,16 4,15.5C4,13.5 5.75,10.75 7.5,9C9.25,7.25 12,6.5 17,8Z" />
        </svg>
      );
      
    default:
      return (
        <div
          key={particle.id}
          style={getParticleStyle(particle)}
        />
      );
  }
};

// Replace the particles map with:

  return (
    <>
      <button
        className={styles.glassButton}
        onClick={() => setShowMenu(!showMenu)}
      >
        <div className={styles.buttonContent}>
          {React.createElement(seasons[season].icon, { size: 20 })}
          <span>Feeling Moody?</span>
        </div>
      </button>

      {showMenu && (
        <div className={styles.glassMenu}>
          {Object.entries(seasons).map(([key, season]) => {
            const IconComponent = season.icon;
            return (
              <div
                key={key}
                className={styles.glassMenuItem}
                onClick={() => selectSeason(key)}
              >
                <IconComponent size={16} />
                <span>{season.name}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Particles */}
     {particles.map(particle => getParticleElement(particle))}
      {/* Background Effects */}
      {season === 'summer' && (
        <>
          <div className={styles.sunRays} />
          <div className={styles.heatShimmer} />
        </>
      )}

      {season === 'rain' && (
        <div className={`${styles.lightning} ${lightning ? styles.flash : ''}`} />
      )}
    </>
  );
};

export default MoodSeasonSwitcher;