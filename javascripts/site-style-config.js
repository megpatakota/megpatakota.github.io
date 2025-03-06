// site-style-config.js
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Montserrat', 'sans-serif'],
      },
      colors: {
        primary: '#ffffff',
        secondary: '#005f73',
        tertiary: '#808080',
        highlight: '#005f73',
        social_buttons: '#4e148c',
        buttons: '#e2cfea',
        buttons_hover: '#e9ecef',
        bg: '#F1FAEE',
        text_primary: '#1D3557',
        text_secondary: '#005f73',
        text_tertiary: '#808080',
        header_text: '#4e148c',
      },
    },
  },
  plugins: [
    function ({ addUtilities, addBase }) {
      // Your existing utility for gradient text
      addUtilities({
        '.gradient-text': {
          background: 'linear-gradient(to right, #6366F1, #EC4899)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
      });

      // Add global (base) font-size rules via media queries
      addBase({
        // For screens below 768px
        '@media (max-width: 767px)': {
          html: {
            fontSize: '0.775rem', // ~14px
          },
        },
        // For screens 768px and above
        '@media (min-width: 768px)': {
          html: {
            fontSize: '1rem', // ~16px
          },
        },
      });
    },
  ],
};
