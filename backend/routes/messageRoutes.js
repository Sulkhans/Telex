import express from "express";
import validateToken from "../middlewares/authMiddleware.js";
import {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
  markAsRead,
} from "../controllers/messageController.js";

const router = express.Router();

router
  .route("/")
  .post(validateToken, sendMessage)
  .get(validateToken, getMessages)
  .put(validateToken, markAsRead);
router
  .route("/:id")
  .put(validateToken, editMessage)
  .delete(validateToken, deleteMessage);

export default router;
