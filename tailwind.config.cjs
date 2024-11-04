/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,svg}'],
  theme: {
    extend: {
      colors: {
        'lks-color': '#f85900',
        'morado':'#AA66D9',
        'verde': '#63DB4B',
        'azul':'#009ff8',
        'marron':' #7f2d00 ',
        'blanco': '#ffffff',
        'negro':'#000000',
        'verde-claro':'#C8E0C9',
        'crudo':'#C8E0D6',
      },
      typography: {
        quoteless: {
          css: {
            'blockquote p:first-of-type::before': { content: 'none' },
            'blockquote p:first-of-type::after': { content: 'none' },
          },
        },
      },
    },
    container: {
      center: true,
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
