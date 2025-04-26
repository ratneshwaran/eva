import type { Config } from 'tailwindcss';

// Tailwind CSS configuration
// @ts-ignore: Safelist is not part of the TS type but supported by Tailwind
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // @ts-ignore: safelist is not in Config type but Tailwind supports it
  safelist: [
    {
      // Include 50,100,200,500,600,700 theme shades for bg/text/border/fill
      pattern: /^(bg|text|border|fill)-(blue|purple|green)-(50|100|200|500|600|700)$/,
    },
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config; 