import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.userId).select("-password");
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Unauthorized" });
      }
      throw error;
    }
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
