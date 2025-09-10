import express from "express";
import "dotenv/config";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import { connect } from "mongoose";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
const app = express();
const PORT = process.env.PORT;
const __dirname = path.resolve();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, //allow frontend to send cookies with requests
  })
);
//this express.json must be come first before app.use because it will first parse JSON then it will
//reach routes
app.use(express.json()); //with this we are able to get what user has entered
//username, password full name and so on, and this we are getting from authcontroller.js
//JWT is JSON web token and its used for authentication
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
