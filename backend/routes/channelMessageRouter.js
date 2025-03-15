import express from "express";
import validateToken from "../middlewares/authMiddleware.js";
import {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
} from "../controllers/channelMessageController.js";

const router = express.Router();

router.use(validateToken);

router.route("/").post(sendMessage).get(getMessages);
router.route("/:id").put(editMessage).delete(deleteMessage);

export default router;
