/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",               // Include the main HTML file
    "./src/**/*.{js,ts,jsx,tsx}", // Include all JavaScript/TypeScript files in the src directory
  ],
  theme: {
    extend: {}, // Add custom theme extensions here if needed
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ], // Add Tailwind plugins here if needed
};
