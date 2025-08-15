import React from 'react'; // Import React because we are using JSX
import { keyframes, styled, alpha } from '@mui/material/styles';
import { Container, Card, Button, Avatar, Box } from '@mui/material';

// --- KEYFRAMES ---

export const neonGlow = keyframes`
  0%, 100% { 
    text-shadow: 0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor;
    box-shadow: 0 0 5px currentColor;
  }
  50% { 
    text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
    box-shadow: 0 0 10px currentColor, 0 0 20px currentColor;
  }
`;

export const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

export const slideInLeft = keyframes`
  from { transform: translateX(-100px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

export const slideInRight = keyframes`
  from { transform: translateX(100px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

export const slideInUp = keyframes`
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export const floatingParticles = keyframes`
  0% { transform: translateY(0px) rotate(0deg); opacity: 1; }
  33% { transform: translateY(-10px) rotate(120deg); opacity: 0.8; }
  66% { transform: translateY(5px) rotate(240deg); opacity: 0.6; }
  100% { transform: translateY(0px) rotate(360deg); opacity: 1; }
`;

export const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
`;

export const rotateAnimation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const sakuraFall = keyframes`
  0% { transform: translateY(-50px) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
`;

// --- STYLED COMPONENTS ---

// Sakura Petal Component
const SakuraPetalRoot = ({ currentTheme, ...otherProps }) => {
  // This component now correctly receives the 'currentTheme' prop.
  if (currentTheme !== 'light') return null;
  // This is JSX, which is why the file needs to be .jsx
  return <Box {...otherProps}>❀</Box>;
};

export const SakuraPetal = styled(SakuraPetalRoot)(({ theme, currentTheme }) => ({
    position: 'absolute',
    top: 0,
    left: `${Math.random() * 100}%`,
    fontSize: '24px',
    color: '#ffb7c5',
    animation: `${sakuraFall} ${10 + Math.random() * 20}s linear infinite`,
    animationDelay: `${Math.random() * 5}s`,
    userSelect: 'none',
    pointerEvents: 'none',
    zIndex: 1,
}));

// PixelmoonContainer
const PixelmoonContainerRoot = ({ currentTheme, ...otherProps }) => {
  return <Container {...otherProps} />;
};

export const PixelmoonContainer = styled(PixelmoonContainerRoot)(({ theme, currentTheme }) => ({
  minHeight: '100vh',
  background: currentTheme === 'dark'
    ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)'
    : 'linear-gradient(135deg, #f0f2ff 0%, #e6f3ff 50%, #dbeafe 100%)',
  position: 'relative',
  padding: '2rem 1rem',

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: currentTheme === 'dark'
      ? `radial-gradient(circle at 20% 20%, ${alpha('#0f3460', 0.3)} 0%, transparent 50%),
         radial-gradient(circle at 80% 80%, ${alpha('#533a7b', 0.3)} 0%, transparent 50%),
         radial-gradient(circle at 40% 40%, ${alpha('#1e40af', 0.2)} 0%, transparent 50%)`
      : `radial-gradient(circle at 20% 20%, ${alpha('#3b82f6', 0.1)} 0%, transparent 50%),
         radial-gradient(circle at 80% 80%, ${alpha('#8b5cf6', 0.1)} 0%, transparent 50%)`,
    pointerEvents: 'none',
  },

  // Mobile responsiveness
  '@media (max-width: 768px)': {
    padding: '1rem 0.5rem',
  },

  '@media (max-width: 480px)': {
    padding: '0.5rem 0.25rem',
  },
}));

// NeonCard
const NeonCardRoot = ({ currentTheme, variant, ...otherProps }) => {
  return <Card {...otherProps} />;
};

export const NeonCard = styled(NeonCardRoot)(({ theme, currentTheme, variant = 'default' }) => {
  const getColors = () => {
    if (currentTheme === 'dark') {
      switch (variant) {
        case 'validate': return { border: '#00f5ff', glow: '#00f5ff' };
        case 'packs': return { border: '#ff6b6b', glow: '#ff6b6b' };
        case 'summary': return { border: '#4ecdc4', glow: '#4ecdc4' };
        case 'payment': return { border: '#ffe66d', glow: '#ffe66d' };
        case 'success': return { border: '#00ff88', glow: '#00ff88' };
        default: return { border: '#00f5ff', glow: '#00f5ff' };
      }
    } else {
      switch (variant) {
        case 'validate': return { border: '#2563eb', glow: '#2563eb' };
        case 'packs': return { border: '#dc2626', glow: '#dc2626' };
        case 'summary': return { border: '#059669', glow: '#059669' };
        case 'payment': return { border: '#d97706', glow: '#d97706' };
        case 'success': return { border: '#059669', glow: '#059669' };
        default: return { border: '#2563eb', glow: '#2563eb' };
      }
    }
  };

  const { border, glow } = getColors();

  return {
    borderRadius: '16px',
    border: `2px solid ${border}`,
    boxShadow: `0 0 15px ${alpha(glow, 0.5)}`,
    background: currentTheme === 'dark' ? 'rgba(26, 26, 26, 0.8)' : '#fff',
    color: currentTheme === 'dark' ? '#e0e0e0' : '#111',
    overflow: 'hidden',
    position: 'relative',
    backdropFilter: 'blur(10px)',
    width: '100%',

    // Mobile responsiveness
    '@media (max-width: 768px)': {
      borderRadius: '12px',
      border: `1px solid ${border}`,
      boxShadow: `0 0 10px ${alpha(glow, 0.3)}`,
    },
  };
});

// PackCard
const PackCardRoot = ({ currentTheme, selected, ...otherProps }) => {
  return <Card {...otherProps} />;
};

export const PackCard = styled(PackCardRoot)(({ theme, currentTheme, selected }) => ({
  background: currentTheme === 'dark'
    ? (selected
        ? 'linear-gradient(145deg, rgba(0, 245, 255, 0.15), rgba(0, 200, 255, 0.08))'
        : 'linear-gradient(145deg, rgba(40, 40, 80, 0.9), rgba(30, 30, 60, 0.9))'
      )
    : (selected
        ? 'linear-gradient(145deg, rgba(37, 99, 235, 0.15), rgba(59, 130, 246, 0.08))'
        : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9))'
      ),
  border: `2px solid ${
    selected
      ? (currentTheme === 'dark' ? '#00f5ff' : '#2563eb')
      : (currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)')
  }`,
  borderRadius: '16px',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  height: '100%',
  minHeight: '180px',
  width: '100%',
  maxWidth: '100%', // Remove fixed constraints for mobile

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: selected
      ? `linear-gradient(45deg, ${alpha(currentTheme === 'dark' ? '#00f5ff' : '#2563eb', 0.1)}, transparent)`
      : 'transparent',
    transition: 'all 0.3s ease',
  },

  '&:hover': {
    transform: 'translateY(-8px) scale(1.05)',
    boxShadow: selected
      ? `0 15px 30px ${alpha(currentTheme === 'dark' ? '#00f5ff' : '#2563eb', 0.3)}`
      : `0 10px 25px ${alpha(currentTheme === 'dark' ? '#ffffff' : '#000000', 0.1)}`,
    '&::before': {
      background: `linear-gradient(45deg, ${
        alpha(currentTheme === 'dark' ? '#00f5ff' : '#2563eb', 0.15)
      }, transparent)`,
    },
  },

  animation: selected ? `${pulseAnimation} 2s infinite` : 'none',

  // Mobile responsive adjustments
  '@media (max-width: 768px)': {
    minHeight: '160px',
    borderRadius: '12px',
    '&:hover': {
      transform: 'translateY(-4px) scale(1.03)',
    },
  },

  '@media (max-width: 480px)': {
    minHeight: '140px',
    borderRadius: '10px',
    border: `1px solid ${
      selected
        ? (currentTheme === 'dark' ? '#00f5ff' : '#2563eb')
        : (currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)')
    }`,
    '&:hover': {
      transform: 'translateY(-2px) scale(1.02)',
    },
  },
}));

// NeonButton
const NeonButtonRoot = ({ currentTheme, variant, ...otherProps }) => {
  return <Button {...otherProps} />;
};

export const NeonButton = styled(NeonButtonRoot)(({ theme, currentTheme, variant = 'primary' }) => {
  const getColors = () => {
    if (currentTheme === 'dark') {
      switch (variant) {
        case 'success': return { bg: '#00ff88', color: '#000', glow: '#00ff88' };
        case 'validate': return { bg: '#00f5ff', color: '#000', glow: '#00f5ff' };
        default: return { bg: '#ff6b6b', color: '#fff', glow: '#ff6b6b' };
      }
    } else {
      switch (variant) {
        case 'success': return { bg: '#059669', color: '#fff', glow: '#059669' };
        case 'validate': return { bg: '#2563eb', color: '#fff', glow: '#2563eb' };
        default: return { bg: '#dc2626', color: '#fff', glow: '#dc2626' };
      }
    }
  };

  const colors = getColors();

  return {
    background: `linear-gradient(45deg, ${colors.bg}, ${alpha(colors.bg, 0.8)})`,
    color: colors.color,
    border: `2px solid ${colors.bg}`,
    borderRadius: '8px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    boxShadow: `0 0 20px ${alpha(colors.glow, 0.4)}`,
    transition: 'all 0.3s ease',

    '&:hover': {
      background: `linear-gradient(45deg, ${alpha(colors.bg, 0.9)}, ${colors.bg})`,
      boxShadow: `0 0 30px ${alpha(colors.glow, 0.6)}, 0 0 60px ${alpha(colors.glow, 0.3)}`,
      transform: 'translateY(-2px)',
      animation: `${neonGlow} 1.5s ease-in-out infinite`,
    },

    '&:disabled': {
      background: currentTheme === 'dark' ? 'rgba(100, 100, 100, 0.3)' : 'rgba(200, 200, 200, 0.3)',
      color: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
      boxShadow: 'none',
      animation: 'none',
      transform: 'none',
    },

    // Mobile responsiveness
    '@media (max-width: 768px)': {
      fontSize: '0.875rem',
      padding: '0.5rem 1rem',
      letterSpacing: '0.5px',
    },

    '@media (max-width: 480px)': {
      fontSize: '0.8rem',
      padding: '0.4rem 0.8rem',
      borderRadius: '6px',
    },
  };
});

// StepIcon
const StepIconRoot = ({ currentTheme, active, completed, ...otherProps }) => {
  return <Avatar {...otherProps} />;
};

export const StepIcon = styled(StepIconRoot)(({ theme, currentTheme, active, completed }) => ({
  width: 48,
  height: 48,
  fontSize: '1.2rem',
  fontWeight: 'bold',

  background: completed
    ? (currentTheme === 'dark' ? '#00ff88' : '#059669')
    : active
    ? (currentTheme === 'dark' ? '#00f5ff' : '#2563eb')
    : (currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'),

  color: completed || active
    ? '#000'
    : (currentTheme === 'dark' ? '#fff' : '#666'),

  border: `2px solid ${
    completed
      ? (currentTheme === 'dark' ? '#00ff88' : '#059669')
      : active
      ? (currentTheme === 'dark' ? '#00f5ff' : '#2563eb')
      : (currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)')
  }`,

  boxShadow: completed || active
    ? `0 0 20px ${alpha(
        completed
          ? (currentTheme === 'dark' ? '#00ff88' : '#059669')
          : (currentTheme === 'dark' ? '#00f5ff' : '#2563eb'),
        0.5
      )}`
    : 'none',

  animation: active ? `${pulseAnimation} 2s infinite` : 'none',

  // Mobile responsiveness
  '@media (max-width: 768px)': {
    width: 40,
    height: 40,
    fontSize: '1rem',
  },

  '@media (max-width: 480px)': {
    width: 36,
    height: 36,
    fontSize: '0.9rem',
  },
}));

// FloatingParticle
const FloatingParticleRoot = ({ currentTheme, ...otherProps }) => {
  return <Box {...otherProps} />;
};

export const FloatingParticle = styled(FloatingParticleRoot)(({ theme, currentTheme }) => ({
  position: 'absolute',
  width: '4px',
  height: '4px',
  background: currentTheme === 'dark' ? '#00f5ff' : '#2563eb',
  borderRadius: '50%',
  animation: `${floatingParticles} 6s ease-in-out infinite`,
  opacity: 0.6,

  // Mobile responsiveness - smaller particles on mobile
  '@media (max-width: 768px)': {
    width: '3px',
    height: '3px',
    opacity: 0.4,
  },

  '@media (max-width: 480px)': {
    width: '2px',
    height: '2px',
    opacity: 0.3,
  },
}));

// Enhanced responsive utilities
export const ResponsiveBox = styled(Box)(({ theme }) => ({
  width: '100%',
  
  // Ensure proper spacing on mobile
  '@media (max-width: 768px)': {
    padding: '0 0.5rem',
  },

  '@media (max-width: 480px)': {
    padding: '0 0.25rem',
  },
}));

// Mobile-optimized container for pack grids
export const PackGridContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  overflow: 'hidden', // Prevent horizontal scroll
  
  '& .MuiGrid-container': {
    width: '100%',
    margin: 0,
    
    '& .MuiGrid-item': {
      paddingLeft: '8px !important',
      paddingTop: '8px !important',
    },
  },

  // Mobile adjustments
  '@media (max-width: 768px)': {
    '& .MuiGrid-item': {
      paddingLeft: '4px !important',
      paddingTop: '4px !important',
    },
  },
}));