import API from "./api";

// 👤 GET logged-in user profile
export const getMyProfile = () =>
  API.get("/user/me");

// ✏️ UPDATE profile
export const updateProfile = (data) =>
  API.put("/user/update", data);