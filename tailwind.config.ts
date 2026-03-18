import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Pixel art retro palette
        'pixel-dark': '#212529',
        'pixel-darker': '#1a1d20',
        'pixel-gray': '#6c757d',
        'pixel-light': '#f8f9fa',
        'pixel-green': '#28a745',
        'pixel-blue': '#007bff',
        'pixel-purple': '#6f42c1',
        'pixel-yellow': '#ffc107',
        'pixel-red': '#dc3545',
        'pixel-cyan': '#17a2b8',
        'pixel-orange': '#fd7e14',
        // NES.css colors
        'nes-black': '#000000',
        'nes-white': '#ffffff',
        'nes-red': '#e4000f',
        'nes-blue': '#2038ec',
        'nes-green': '#00e800',
        'nes-yellow': '#f8d800',
        'nes-purple': '#741b8f',
        'nes-pink': '#f8a4b4',
        'nes-orange': '#f87800',
        'nes-brown': '#906030',
        'nes-gray': '#808080',
      },
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'cursive', 'monospace'],
        'mono': ['monospace'],
      },
      boxShadow: {
        'pixel': '4px 4px 0px 0px rgba(0,0,0,0.5)',
        'pixel-sm': '2px 2px 0px 0px rgba(0,0,0,0.5)',
        'pixel-lg': '6px 6px 0px 0px rgba(0,0,0,0.5)',
      },
      animation: {
        'pixel-pulse': 'pixel-pulse 2s ease-in-out infinite',
        'blink': 'blink 1s step-end infinite',
        'working': 'working 0.5s ease-in-out infinite alternate',
      },
      keyframes: {
        'pixel-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'blink': {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        'working': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-2px)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
