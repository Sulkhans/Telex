import express from "express";
import validateToken from "../middlewares/authMiddleware.js";
import {
  createUser,
  verifyEmail,
  loginUser,
  getUser,
  updateStatus,
  logoutUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", createUser);
router.put("/verify", verifyEmail);
router.post("/login", loginUser);
router.get("/", validateToken, getUser);
router.put("/status", validateToken, updateStatus);
router.post("/logout", validateToken, logoutUser);

export default router;
