export const LightTheme = {
  name: "light",

  // Core surfaces
  background: "#FBE6DA", // Soft champagne pink (full screen backgrounds)
  surface: "#FFFFFF", // Card, modal, input background

  // Brand identity colors
  primary: "#2DB5A9", // Main CTA (e.g., "Register", "Next")
  secondary: "#8BE4DB", // Secondary CTA or support highlight
  accent: "#EBB7AD", // Subtle UI touch or inactive button fill

  // Functional states
  info: "#659B5E", // Success or "safe to proceed"
  danger: "#77141F", // Alerts, emergencies, red zone

  // Typography
  text: "#282C3E",// Deep contrast for strong readability
  
};
export const DarkTheme = {
  name: "dark",

  // Core surfaces
  background: "#282C3E", // Night blue (main background)
  surface: "#1E1E1E", // Card/modal surfaces

  // Brand identity colors
  primary: "#8BE4DB", // Bright CTA on dark (e.g., "Register")
  secondary: "#2DB5A9", // Supportive action or hover state
  accent: "#EBB7AD", // Friendly contrast or neutral fills

  // Functional states
  info: "#2EC4B6", // Highlighted status (success/info)
  danger: "#77141F", // Red alert

  // Typography
  text: "#FBE6DA", // Light on dark readability
};
