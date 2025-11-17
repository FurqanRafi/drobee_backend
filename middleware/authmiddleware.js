export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 👇 Debug karo token decode ho raha hai ya nahi
    console.log("🔓 Decoded Token:", decoded);
    
    req.user = { _id: decoded.id || decoded._id }; // ✅ Proper format
    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};