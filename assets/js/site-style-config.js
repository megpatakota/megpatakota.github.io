// site-style-config.js
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Brand colors - Modern Tech Palette
        primary: '#0F172A',         // Slate 900 - Deep dark
        buttons: '#6366F1',         // Indigo 500 - Primary accent
        accent: '#22D3EE',          // Cyan 400 - Secondary accent
        
        // Background colors
        bg_dark: '#0F172A',         // Deep slate  
        bg_light: '#F8FAFC',        // Slate 50 - Light backgrounds
        bg_card: '#1E293B',         // Slate 800 - Card on dark
        
        // Text colors
        text_primary: '#0F172A',    // Slate 900 - main headings on light
        text_secondary: '#475569',  // Slate 600 - secondary text
        text_tertiary: '#64748B',   // Slate 500 - body text
        text_button: '#FFFFFF',     // White - text on buttons
        
        // Dark mode / Dark section text
        dark_text_primary: '#F8FAFC',   // Slate 50
        dark_text_secondary: '#CBD5E1', // Slate 300
        dark_text_tertiary: '#94A3B8',  // Slate 400
        
        // Utility
        header: '#FFFFFF',   
        header_text: '#0F172A',
        
        // Gradient accents
        gradient_start: '#6366F1',    // Indigo
        gradient_end: '#22D3EE',      // Cyan
        
        // Animation colors - tech inspired
        animation: {
          color1: '#E0E7FF',       // Indigo 100
          color2: '#CFFAFE',       // Cyan 100
          color3: '#F1F5F9',       // Slate 100
        }
      },
    },
  }
};
