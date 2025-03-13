import express from "express";
import validateToken from "../middlewares/authMiddleware.js";
import {
  acceptFriendRequest,
  deleteFriend,
  getFriendRequests,
  getFriendsList,
  sendFriendRequest,
} from "../controllers/friendController.js";

const router = express.Router();

router
  .route("/")
  .post(validateToken, sendFriendRequest)
  .get(validateToken, getFriendRequests);
router.get("/list", validateToken, getFriendsList);
router
  .route("/:id")
  .put(validateToken, acceptFriendRequest)
  .delete(validateToken, deleteFriend);

export default router;
