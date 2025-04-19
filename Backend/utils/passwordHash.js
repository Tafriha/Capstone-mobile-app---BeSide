const bcrypt = require("bcrypt");

/**
 * Hash a password using bcrypt
 * @param {string} password - The plain text password to hash
 * @returns {Promise<string>} The hashed password
 */
const passwordHash = async (password) => {
  const saltRounds = 10;
  try {
    console.log(password);
    return await bcrypt.hash(password, 10);
  } catch (error) {
    throw new Error(`Error hashing password: ${error.message}`);
  }
};

module.exports = passwordHash;