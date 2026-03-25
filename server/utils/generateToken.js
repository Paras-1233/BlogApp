import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign(
    { id }, // 🔥 MUST BE ID (NOT role)
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export default generateToken;