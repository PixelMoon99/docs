// seasonConfigs.js

// A public URL for a transparent leaf image. Replace with your own if you like.
const leafImageUrl = 'https://www.freeiconspng.com/uploads/leaf-png-25.png';

export const seasonConfigs = {
  Normal: {
    particles: {
      number: { value: 0 }, // No particles for Normal
    },
  },

  Summer: {
    fullScreen: { enable: true },
    particles: {
      number: { value: 30, density: { enable: true, value_area: 800 } },
      color: { value: ['#FFD700', '#FFA500', '#FFC400'] },
      shape: { type: 'circle' },
      opacity: {
        value: {min: 0.3, max: 0.8},
        animation: { enable: true, speed: 1, sync: false, startValue: "random" },
      },
      size: {
        value: {min: 1, max: 3},
        animation: { enable: true, speed: 2, sync: false, startValue: "random" },
      },
      move: {
        enable: true,
        speed: {min: 0.5, max: 1.5},
        direction: 'top',
        straight: false,
        outModes: {
          default: 'out',
        },
      },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'bubble' },
      },
      modes: {
        bubble: { distance: 200, size: 5, duration: 2, opacity: 1 },
      },
    },
    detectRetina: true,
  },

  Autumn: {
    fullScreen: { enable: true },
    particles: {
      number: { value: 50, density: { enable: true, value_area: 800 } },
      shape: {
        type: 'image',
        image: {
          src: leafImageUrl,
          width: 100,
          height: 100,
        },
      },
      opacity: { value: 1 },
      size: { value: { min: 10, max: 20 } },
      move: {
        enable: true,
        speed: 3,
        direction: 'bottom',
        straight: false,
        random: true,
        outModes: {
          default: 'out',
        },
        gravity: {
          enable: true,
          acceleration: 2,
        },
        wobble: { // Realistic drift
          enable: true,
          distance: 15,
          speed: 10,
        },
      },
      rotate: { // Realistic tumble
        value: { min: 0, max: 360 },
        direction: 'random',
        animation: {
          enable: true,
          speed: 20,
        },
      },
    },
    detectRetina: true,
  },

  Winter: {
    fullScreen: { enable: true },
    particles: {
      number: { value: 100, density: { enable: true, value_area: 800 } },
      color: { value: '#ffffff' },
      shape: { type: 'circle' },
      opacity: { value: { min: 0.4, max: 0.9 } },
      size: { value: { min: 1, max: 4 } },
      move: {
        enable: true,
        speed: 2,
        direction: 'bottom',
        straight: false,
        random: true,
        outModes: {
          default: 'out',
        },
      },
      // Sparkle/Glow effect
      twinkle: {
        particles: {
          enable: true,
          frequency: 0.05,
          opacity: 1,
        },
      },
    },
    detectRetina: true,
  },

  Rain: {
    fullScreen: { enable: true },
    particles: {
      number: { value: 200, density: { enable: true, value_area: 800 } },
      color: { value: '#a0b4c8' },
      shape: { type: 'line' },
      opacity: { value: { min: 0.3, max: 0.7 } },
      size: {
        value: { min: 10, max: 20 },
      },
      move: {
        enable: true,
        speed: {min: 15, max: 25},
        direction: 'bottom',
        straight: true,
        outModes: {
          default: 'out',
        },
      },
      // Multiple layers for depth
      layers: [
        {
          size: { value: {min: 1, max: 2}, },
          speed: {min: 5, max: 10},
          opacity: { value: { min: 0.2, max: 0.5 } },
          zIndex: 1
        },
        {
          size: { value: { min: 3, max: 5 }, },
          speed: {min: 10, max: 18},
          opacity: { value: { min: 0.4, max: 0.7 } },
          zIndex: 2
        }
      ]
    },
    detectRetina: true,
  },
};