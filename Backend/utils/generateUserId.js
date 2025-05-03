const { v4: uuidv4 } = require("uuid");

/**
 * Generates a unique user ID based on country code, state, postal code and timestamp
 * Format: CC-ST-PC-XXXXXX
 * Where:
 * - CC is the country code
 * - ST is the first 2 chars of state/province (or "XX" if not available)
 * - PC is first 3 chars of postal code (or "XXX" if not available)
 * - XXXXXX is a unique identifier (first 6 chars of UUID)
 *
 * @param {Object} userData - User data containing country code, state, and postal code
 * @returns {String} - Unique user ID
 */
const generateUserId = (userData) => {
  try {
    // Extract information
    const countryCode = (userData.address.countryCode || "XX").toUpperCase();

    // Extract first 2 characters of state or use XX if not available
    const state = userData.address.state
      ? userData.address.state.substring(0, 2).toUpperCase()
      : "XX";

    // Extract first 3 characters of postal code or use XXX if not available
    const postalCode = userData.address.postalCode
      ? userData.address.postalCode.substring(0, 3).toUpperCase()
      : "XXX";

    // Generate a unique identifier
    const uniqueId = uuidv4().substring(0, 6).toUpperCase();

    // Combine all parts to create the unique user ID
    const userId = `${countryCode}-${state}-${postalCode}-${uniqueId}`;

    return userId;
  } catch (error) {
    console.error("Error generating user ID:", error);

    // Fallback to a simpler ID format if there's an error
    return `XX-XX-XXX-${uuidv4().substring(0, 6).toUpperCase()}`;
  }
};

module.exports = generateUserId;