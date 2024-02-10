import express from "express";
import {
  register,
  login,
  logout,
  getMyProfile,
  changePassword,
  updateProfile,
  updateProfilePicture,
  forgetPasssword,
  resetPassword,
} from "../controllers/userController.js";
import { isAuthentication } from "../middlewares/auth.js";

const router = express.Router();

// Register new User
router.route("/register").post(register);

// Login
router.route("/login").post(login);

// loggout
router.route("/logout").get(logout);

// Get my profile
router.route("/me").get(isAuthentication, getMyProfile);

// Change Password
router.route("/change-password").put(isAuthentication, changePassword);

// Update Profile
router.route("/update-profile").put(isAuthentication, updateProfile);

// Update Profile Picture
router
  .route("/update-profile-picture")
  .put(isAuthentication, updateProfilePicture);

// FOrget Password
router.route("/forget-password").post(forgetPasssword);

// Reset Password
router.route("/reset-password/:token").put(resetPassword);
export default router;
