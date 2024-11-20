module.exports = {
  content: ['./*.html'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    extend: {
      fontFamily: {
        sans: ['Bricolage Grotesque', 'sans-serif'],
        serif: ['Inter'],
      },
      letterSpacing: {
        widest: '.3em',
      },
    },
  },
  plugins: [],
}
