import express from "express";
import { createUser, verifyEmail } from "../controllers/userController.js";

const router = express.Router();

router.route("/").post(createUser);
router.post("/verify", verifyEmail);

export default router;
