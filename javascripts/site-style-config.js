// site-style-config.js
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['sans-serif'],
      },
      colors: {
        // Brand colors
        primary: '#1E293B',         // Dark slate blue - modern tech primary
        buttons: '#3B82F6',         // Vibrant blue - standout action color
        
        // Background colors
        bg_cover: '#0F172A',        // Deep navy - modern dark sections
        bg_light: '#F1F5F9',        // Light blue-gray - subtle light sections
        
        // Text colors
        text_primary: '#1E293B',    // Dark slate blue - main headings
        text_secondary: '#0369A1',  // Ocean blue - secondary headings/accents
        text_tertiary: '#64748B',   // Slate gray - body text
        text_button: '#FFFFFF',     // White - text on buttons
        
        // Dark mode versions
        dark_buttons: '#3B82F6',    // Same blue for buttons in dark mode
        dark_text_primary: '#F8FAFC', // Off-white - dark mode headings
        dark_text_secondary: '#94A3B8', // Light blue-gray - dark mode secondary text
        dark_text_button: '#FFFFFF',   // White - dark mode button text
        
        // Utility
        header: '#FFFFFF',          // White header with transparency handled in CSS
      },
    },
  }
};
