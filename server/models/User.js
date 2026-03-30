import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    //NEW FIELDS
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "No bio yet.",
    },
    role: {
      type: String,
      default: "Author",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);