import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getRecommendedUsers,
  getMyFriends,
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequests,
  getOutgoingFriendReqs,
} from "../controllers/user.controller.js";
const router = express.Router();

//apply aut middlewarte to every route
router.use(protectRoute);
//Below:Get Recommended users will find and siplay those users which share common interest
//with the current authenticated user so that it can connect with it, if they want to
router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

// WE can add reset password option for user that's why user controller is kept
//seperate from auth controller
//Here Id is dynamic
router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);
router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendReqs);
export default router;
