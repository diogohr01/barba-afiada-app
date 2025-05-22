
/**
 * Application configuration
 * Change these settings to adjust the app for individual barber or business use
 */

export const APP_CONFIG = {
  // Set to "individual" for single barber or "business" for multiple barbers
  MODE: "business", 
  
  // App information
  APP_NAME: "BarberApp",
  
  // Business/Individual information
  BUSINESS_NAME: "BarberShop Elite",
  BUSINESS_ADDRESS: "Rua das Tesouras, 123 - Centro",
  BUSINESS_PHONE: "(11) 99999-9999",
  BUSINESS_EMAIL: "contato@barbershopp.com",
  BUSINESS_WHATSAPP: "5511999999999",
  
  // App theme colors - change these to customize the app
  THEME: {
    PRIMARY: "#9b87f5",
    PRIMARY_HOVER: "#8B5CF6",
    SECONDARY: "#7E69AB",
    TERTIARY: "#6E59A5", 
    BACKGROUND: "#1A1F2C",
    CARD_BACKGROUND: "#403E43",
    TEXT: "#FFFFFF",
    TEXT_SECONDARY: "#C8C8C9",
  }
};

/**
 * Helper functions for app configuration
 */

export const isBusinessMode = () => APP_CONFIG.MODE === "business";
export const isIndividualMode = () => APP_CONFIG.MODE === "individual";

/**
 * Get application theme colors
 */
export const getThemeColors = () => APP_CONFIG.THEME;

/**
 * Get business or individual barber name based on current mode
 */
export const getBusinessName = () => APP_CONFIG.BUSINESS_NAME;
