/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "soft-pulse": {
          "0%, 100%": { opacity: 0.2 },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "soft-pulse": "soft-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
