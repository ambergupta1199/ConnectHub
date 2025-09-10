import jwt from "jsonwebtoken";
import User from "../models/User.js";
export const protectRoute = async (req, res, next) => {
  try {
    //in this section we verify the token using cookie parser used in server.js
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized-No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    //if the token is not valid or expired, decoded will be null
    //we have token but that can be invalid, below we are checking
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized-Invalid token" });
    }
    //here we are checking whether user exists in database
    //we are deselecting the password field to get displayed
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized-User not found" });
    }
    req.user = user;
    //next() meaning after verifying the token and user, we call next()
    //to proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
