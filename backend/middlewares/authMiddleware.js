import jwt from "jsonwebtoken";
import prisma from "../db/prisma.js";

const validateToken = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await prisma.user.findUnique({
          where: { id: decoded.userId },
        });
        next();
      } catch (error) {
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    } else {
      res.status(401);
      throw new Error("Not authorized, no token exist");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default validateToken;
