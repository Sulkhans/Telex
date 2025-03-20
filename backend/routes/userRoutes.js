import express from "express";
import validateToken from "../middlewares/authMiddleware.js";
import {
  createUser,
  verifyEmail,
  loginUser,
  getUser,
  logoutUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", createUser);
router.put("/verify", verifyEmail);
router.post("/login", loginUser);
router.get("/", validateToken, getUser);
router.post("/logout", logoutUser);

export default router;
