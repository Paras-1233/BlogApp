import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { username, name, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      name: name || username, // Use name if provided, otherwise use username
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      avatar: user.avatar || "",
      bio: user.bio || "",
      role: user.role || "",
      token: generateToken(user._id),
    });

  } catch (err) {
    console.error(err);

    // 🔥 HANDLE DUPLICATE ERROR
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Username or Email already exists",
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};
// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        username: user.username,
        name: user.name || user.username,
        email: user.email,
        avatar: user.avatar || "",
        bio: user.bio || "",
        role: user.role || "",
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};