import User from "../models/User.js";

// ✅ GET logged-in user
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ UPDATE profile
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, role, avatar } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // update fields only if provided
    user.name = name ?? user.name;
    user.bio = bio ?? user.bio;
    user.role = role ?? user.role;
    user.avatar = avatar ?? user.avatar;

    await user.save();

    const updatedUser = await User.findById(req.user.id).select("-password");

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};