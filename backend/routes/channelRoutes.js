import express from "express";
import validateToken from "../middlewares/authMiddleware.js";
import {
  createChannel,
  getChannels,
  deleteChannel,
  updateChannel,
  generateInvite,
  joinChannel,
  leaveChannel,
  updateMember,
  removeMember,
} from "../controllers/channelController.js";

const router = express.Router();

router.use(validateToken);

router.route("/").post(createChannel).get(getChannels);
router.post("/join/:token", joinChannel);
router.post("/:id/invite", generateInvite);
router.delete("/:id/leave", leaveChannel);
router.route("/:id/admin").put(updateMember).delete(removeMember);
router.route("/:id").put(updateChannel).delete(deleteChannel);

export default router;
