// middleware/isLoggedIn.js
const jwt = require("jsonwebtoken");

const isLoggedIn = async (req, res, next) => {
  try {
   
    const token = req.cookies.token;
    // 1. Check if cookie exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not logged in. Token missing.",
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user data to request (VERY useful)
    req.user = decoded;

    // 4. Allow request to continue
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: error.message
    });
  }
};

module.exports = isLoggedIn;