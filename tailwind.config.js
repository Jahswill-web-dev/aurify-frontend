/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#F7931A",
        "secondary": "#FEF2CF",
        "p-text": "#817474",
        "p-text-darker": "#5D4D4D",
      },
      fontSize:{
        "l-head":"35px",
        "l-sub-head":"28px",
        "l-description":"20px",
        "x-head":"24px",
        "x-sub-head":"20px",
        "x-description":"12px"
      }
    },
  },
  plugins: [],
};
