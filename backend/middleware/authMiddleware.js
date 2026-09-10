import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protect = async (req, res, next) => {
  try {
    //Get authorization header
    const authHeader = req.headers.authorization;
    //check whether token exist
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized , no token",
      });
    }

    //extract token
    const token = authHeader.split(" ")[1];
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //find user from decoded userId
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "user not found",
      });
    }
    //Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      message: "Not authorized , invalid token",
    });
  }
};

export default protect;
