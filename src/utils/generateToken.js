const jwt = require("jsonwebtoken");

/**
 * Generates a JWT token for a user
 * @param {string} userId - MongoDB user _id
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = generateToken;
