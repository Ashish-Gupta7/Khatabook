const jwt = require("jsonwebtoken");
const dbgr = require("debug")("development:generateToken");

const generateToken = (user) => {
  try {
    return jwt.sign(
      { email: user.email, id: user._id },
      process.env.JSON_WEB_TOKEN
    );
  } catch (err) {
    dbgr(`Error during generateToken: ${err.message}`);
    throw new Error("Failed to generate token. Please try again.");
  }
};

module.exports.generateToken = generateToken;
