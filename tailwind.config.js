module.exports = {
  content: ['./*.html'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px'
    },
    extend: {
      fontFamily: {
        sans: ['Josefin Sans', 'sans-serif'],
        serif: ['Inter', 'serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
