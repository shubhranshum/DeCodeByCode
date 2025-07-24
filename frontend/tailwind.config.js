// tailwind.config.js
module.exports = {
  // Add this 'content' section
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  
  theme: {
    extend: {
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'cursive'],
        'mono-retro': ['"VT323"', 'monospace'],
      },
      boxShadow: {
        'chunky': '4px 4px 0px #27272a',
        'pixel': '4px 4px 0px rgba(0,255,0,0.7)',
        'retro-box': '4px 4px 0px rgba(128, 90, 213, 0.8), 8px 8px 0px rgba(67, 56, 202, 0.6)',
        'retro-button': '3px 3px 0px rgba(0,0,0,0.4)',
        'retro-button-hover': '2px 2px 0px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};