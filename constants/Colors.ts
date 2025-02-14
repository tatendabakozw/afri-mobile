const primaryColor = '#29A1AF';
const tintColorLight = primaryColor; // Using primary as the tint for light mode
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000', // Dark text for readability
    background: '#fff', // Light background
    tint: tintColorLight, // Highlight color
    tabIconDefault: '#ccc', // Neutral default for icons
    tabIconSelected: tintColorLight, // Selected icons in primary color
    primary: primaryColor, // Added primary color
    secondary: '#26A69A', // Slightly darker or complementary
    accent: '#D4F1F2', // Accent light shade
    border: '#E0E0E0', // Neutral border for components
  },
  dark: {
    text: '#fff', // Light text for contrast
    background: '#121212', // Dark mode-friendly background
    tint: tintColorDark, // White as the main tint in dark mode
    tabIconDefault: '#888', // Dimmer default icon color
    tabIconSelected: tintColorDark, // Selected icons in white
    primary: primaryColor, // Primary color consistent across themes
    secondary: '#007C84', // Darker shade of primary for accents
    accent: '#1A2E3B', // Subtle accent color
    border: '#333', // Darker border for dark mode
  },
};
