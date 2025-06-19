// server/middleware/authMiddleware.js

const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import the User model

// Middleware function to protect routes
const protect = async (req, res, next) => {
  let token;

  // Check if the authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header (e.g., "Bearer YOUR_TOKEN_HERE")
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the authenticated user to the request object (without the password)
      // This makes user data available in subsequent route handlers
      req.user = await User.findById(decoded.id).select("-password"); // Exclude password from user object
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error("Not authorized, token failed:", error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // If no token is found
  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
