import express from "express";
import {
  login,
  signup,
  logout,
  onboard,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();
//this signup will get attached to /api/auth coming from server.js file
//here we have used router.get to just check whether we are reaching this route or not
//but in reality these methods will be router.post only
router.post("/signup", signup);
router.post("/login", login);

//Why logout is post method?
// Answer: Post is for operations that change the server state and logging out does that. It destroys a session invalids a token. So it basically updates something on the
// server side and that's why we would like to keep this as post.
router.post("/logout", logout);
//protectroute typically used to check if the request is authenticated (e.g. by verifying a JWT, checking session, etc.).
// If authentication passes → it calls next() so the request moves on to onboard.
router.post("/onboarding", protectRoute, onboard);

//to check if user is logged in
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});
export default router;
