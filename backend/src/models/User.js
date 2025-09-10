//This file got created to define the schema in our DB
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema(
  {
    //these are all objects
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true, minlength: 6 },
    bio: {
      type: String,
      default: "",
    },
    profilePic: {
      type: String,
      default: "",
    },
    nativeLanguage: {
      type: String,
      default: "",
    },
    learningLanguage: {
      type: String,

      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    //This is for checking whether all profile filling details are added or not
    //After that is he can connect with some one and chat
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    //we are storing friends in terms of an id, if y is friend of x then y's id
    //will be updated in x's friend array
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);
//ABove: This timestamp is creted to add functionality of CreatedAt, updatedAt
//It means create model for user with this schema

//Below: First save: "mypassword" → hash1
// Second save (updating email): hash1 → bcrypt.hash(hash1) = hash2
// → Now the stored password no longer matches the real one
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    //current user's password looged in got hashed with salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  const isPasswordCorrect = await bcrypt.compare(
    enteredPassword,
    this.password //this.password is in database
  );
  return isPasswordCorrect;
};

//this below line will add user created in our DB
const User = mongoose.model("User", userSchema);

export default User;
