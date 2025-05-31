import jwt from "jsonwebtoken";
import adminModel from "../models/admin/adminModel.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Access Denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer "

    // ✅ Verify token
    const decoded = jwt.verify(token, "4r+MgDl67/94bAf42+MK+rhTTrA35KxGBaLd5T1HFIU=");
    
    // ✅ Check if token exists in the admin database
    const admin = await adminModel.findOne({ _id: decoded.id, token });
    if (!admin) {
      return res.status(403).json({ success: false, message: "Invalid token or session expired." });
    }

    // ✅ Attach admin info to request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: "Invalid token." });
  }
};

export default authMiddleware;
