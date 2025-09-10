// really want to put all this logic into here in that auth.router.js file. Instead, we would like to create a
// folder called controllers and inside that create this file, here we will right all our definintions of these
//funcitons
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";
import jwt from "jsonwebtoken";
export async function signup(req, res) {
  const { email, password, fullName } = req.body;
  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 character" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists. Please use different account ",
      });
    }
    //Will create random number from 1-100
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar-placeholder.iran.liara.run/public/${idx}.png`;

    //     await User.create(...)
    // → Shortcut that does both: new User(...) + user.save().
    // → Returns a saved document in one step.

    // new User(...)
    // → Only creates a new unsaved object in memory.
    // → You must call .save() to persist it.

    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: randomAvatar,
    });

    // Below: To create user in Stream.io also so that it handles authentication accordingly
    //for video calls page access and chatting access only authorized user can access
    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
      console.log(`Stream user created for ${newUser.fullName}`);
    } catch (error) {
      console.log("Error creating Stream user:", error);
    }

    //Below: token generated for each user, and userId is to know which user owns which token
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attack
      sameSite: "strict", //prevent CSRF attack
      secure: process.env.NODE_ENV === "production", //secure connection only in production
    });
    //this means new user has been created in the datavase
    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

//LOGIN
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    //401 means unauth access
    if (!user)
      return res.status(401).json({ message: "Invalid Email or Password" });

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Invalid Email or Password" });

    //Below used for creating token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attack
      sameSite: "strict", //prevent CSRF attack
      secure: process.env.NODE_ENV === "production", //secure connection only in production
    });
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in Login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

//LOGOUT
export function logout(req, res) {
  //Now clearing the cookies created earlier
  //My token name is jwt
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logout Successful" });
}

export async function onboard(req, res) {
  try {
    const userId = req.user._id;
    const {
      fullName,
      bio,

      nativeLanguage,
      learningLanguage,
      location,
    } = req.body;
    if (
      !fullName ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
        //here filter(boolean means jo missing fields hai vohi dikhao)
      });
    }
    //Below:By default, findByIdAndUpdate returns the old document (before the update).

    // Setting { new: true } makes it return the updated document instead.
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      //...req.body sab fields laadein ga hume
      { ...req.body, isOnboarded: true },
      { new: true }
    );
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    // Here we are updating or inserting the user in the stream after onboarding
    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
      console.log(
        `Stream user updated after onboarding for ${updatedUser.fullName}`
      );
    } catch (streamError) {
      console.log(
        "Error updating Stream user during onboarding:",
        streamError.message
      );
    }
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
