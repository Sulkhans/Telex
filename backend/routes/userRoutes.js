import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  verifyEmail,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", createUser);
router.post("/verify", verifyEmail);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;
