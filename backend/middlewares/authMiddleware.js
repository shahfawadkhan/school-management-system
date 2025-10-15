import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; 

  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const isAdminOrTeacher = (req, res, next) => {
  if (req.user?.role === "admin" || req.user?.role === "teacher") {
    return next();
  }
  return res.status(403).json({ message: "Not authorized. Admin or Teacher access required." });
};

