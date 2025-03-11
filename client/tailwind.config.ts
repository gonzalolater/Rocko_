import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blackPrimary: '#141414',
        blackSecondary: '#545454',
        blackTertiary: '#848484',
        whitePrimary: '#FFFFFF',
        whiteSecondary: '#E6E6E6',
        whiteTertiary: '#F9F9F9',
        grayPrimary: '#EEEEEE',
        blue: '#2C3B8D',
      },
      fontFamily: {
        inter: ['Inter var', 'sans-serif'],
      },
      margin: {
        '-3px': '-3px',
      },
    },
  },
  plugins: [],
};
export default config;