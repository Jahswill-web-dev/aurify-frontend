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
        "primary-25": "#FFB74D",
        "primary-50": "#FBB040",
        "primary-100": "#F7931A",
        "primary-200": "#C97516",
        "accent-25": "#FFF6DB",
        "accent-50": "#FFEB9B",
        "accent-100": "#FEF2CF",
        "accent-200": "#E2D89F",
        "grey-25": "#D3D3D3",
        "grey-50": "#817474",
        "grey-100": "##808080",
        "grey-200": "#333333",
        "off-white": "#F5F5F5",
        "primary": "#F7931A",
        "secondary": "#FEF2CF",
        "p-text": "#817474",
        "p-text-darker": "#5D4D4D",
      },
      fontSize:{
        "xl-head":"40px",
        "l-head":"35px",
        "l-sub-head":"28px",
        "l-description":"20px",
        "xx-head":"30px",
        "x-head":"24px",
        "x-sub-head":"20px",
        "x-description":"12px",
        "h1":"38px",
        "h2":"30px",
        "h3":"24px",
        "h4":"20px",
        "h5":"16px",
        "h6":"12px",
      }
    },
  },
  plugins: [],
};
