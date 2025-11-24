import jwt from "jsonwebtoken";
import D_User from "../models/d_userSchema.js";
import D_Admin from "../models/d_AdminSchema.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // USER check
    let user = await D_User.findById(decoded.id).select("-password");

    // ADMIN check
    if (!user) {
      user = await D_Admin.findById(decoded.id).select("-password");
    }

    if (!user) {
      return res.status(404).json({ message: "User/Admin not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
