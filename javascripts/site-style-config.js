// site-style-config.js
tailwind.config = {
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'Roboto', 'Montserrat', 'sans-serif'],
        },
        colors: {
          primary: '#ffffff',           // Clean white
          secondary: '#005f73',        
          tertiary: '#808080',         
          highlight: '#005f73',       
          social_buttons: '#4e148c',   
          buttons: '#e2cfea',          // Deep navy for buttons
          buttons_hover: '#e9ecef', 
          bg: '#F1FAEE',               // Soft muted white for the main background
          text_primary: '#1D3557',     // Strong dark text
          text_secondary: '#005f73',
          text_tertiary: '#808080',    // Subtle muted text for balance
          header_text: '#4e148c',     
        },
      }
    },
    plugins: [
      function ({ addUtilities }) {
        addUtilities({
          '.gradient-text': {
            background: 'linear-gradient(to right, #6366F1, #EC4899)',
            '-webkit-background-clip': 'text',
            '-webkit-text-fill-color': 'transparent',
          },
        });
      },
    ],
  };
  