import jwt from "jsonwebtoken";
import User from "../models/User.js";

const auth = (roles = []) => {
    return async (req, res, next) => {
        try {
            // Get token from header
            const token = req.header("Authorization")?.replace("Bearer ", "");

            if (!token) {
                return res.status(401).json({
                    success: false,
                    error: "Access denied. No token provided."
                });
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find user
            const user = await User.findById(decoded.userId).select("-password");

            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: "Invalid token. User not found."
                });
            }
      
            if (!user.isActive) {
                return res.status(401).json({
                    success: false,
                    error: "Account is deactivated."
                });
            }

            // Check role permission
            if (roles.length && !roles.includes(user.role)) {
                return res.status(403).json({
                    success: false,
                    error: "Insufficient permission for this action"
                });
            }
            // Add user to request
            req.user = user;

            // Update last login
            user.lastLogin = Date.now();
            await user.save({validateBeforeSave: false});
        
            next();
        } catch (err) {
            console.error("Auth middleware error:", err.message);

            if(err.name === "JsonWebTokenError") {
                return res.status(401).json({
                    success: false,
                    error: "Invalid token."
                });
            }

            if (err.name === "TokenExpiredError") {
                return res.status(401).json({
                    success: false,
                    error: "Token has expired"
                });
            }

            res.status(500).json({
                success: false,
                error: "Authentication failed"
            });
        }
    };
};

export default auth;