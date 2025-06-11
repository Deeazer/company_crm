/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-purple': '#8B5CF6',
        'cyber-pink': '#EC4899',
        'cyber-blue': '#3B82F6',
      },
      fontFamily: {
        'cyber': ['Orbitron', 'sans-serif'],
        'cyber-body': ['Rajdhani', 'sans-serif'],
      },
      boxShadow: {
        'cyber': '0 0 10px #00ff9f, 0 0 20px #00ff9f',
        'cyber-hover': '0 0 15px #00ff9f, 0 0 30px #00ff9f',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { textShadow: '0 0 10px #00ff9f, 0 0 20px #00ff9f' },
          '100%': { textShadow: '0 0 20px #00ff9f, 0 0 30px #00ff9f' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}; 