import { User } from "../models/User.js";
import { Course } from "../models/Course.js";
import crypto from "crypto";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";

import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
const register = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  // const file =  req.file;

  if (!name || !email || !password)
    return next(new ErrorHandler("Please fill all feilds", 400));

  let user = await User.findOne({ email });

  if (user)
    return next(new ErrorHandler("User already exist with this email", 409));

  // Upload to cloudinary

  user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "tempid",
      url: "tempurl",
    },
  });
});

const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new ErrorHandler("Please fill all feilds", 400));

  const user = await User.findOne({ email }).select("+password");

  if (!user) return next(new ErrorHandler("Invalid Email or Password", 404));

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return next(new ErrorHandler("Invalid Email or Password", 404));

  sendToken(res, user, `Welcome back ${user.name}`, 200);
});

const logout = catchAsyncError(async (req, res, next) => {
  return res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .json({ success: true, message: "Logged out successfully" });
});

const getMyProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  return res
    .status(200)

    .json({ success: true, user });
});

const changePassword = catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword)
    return next(new ErrorHandler("Please fill all feilds", 400));

  const user = await User.findById(req.user._id).select("+password");
  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) return next(new ErrorHandler("Invalid old Password", 400));

  user.password = newPassword;

  await user.save();
  return res
    .status(200)
    .json({ success: true, message: "Passoword change successfully" });
});

const updateProfile = catchAsyncError(async (req, res, next) => {
  const { name, email } = req.body;

  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (email) user.email = email;

  await user.save();
  return res
    .status(200)
    .json({ success: true, message: "Profile update successfully" });
});

const updateProfilePicture = catchAsyncError(async (req, res, next) => {
  return res
    .status(200)
    .json({ success: true, message: "Profile Picture update successfully" });
});

const forgetPasssword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) return next(new ErrorHandler("User not found", 400));

  const resetToken = await user.getResetToken();

  await user.save();

  const url = `${process.env.FRONT_END_URL}/reset-password/${resetToken}`;

  const message = `Click on the link to reset your password ${url}. If you are not requested then please ignore it`;

  await sendEmail(user.email, "LMS Reset Password", message);

  return res.status(200).json({
    success: true,
    message: `Reset Password Token has been send to ${user.email}`,
  });
});

const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });

  if (!user)
    return next(
      new ErrorHandler("Token has been expired or Invalid Token", 401)
    );

  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  await user.save();
  return res
    .status(200)
    .json({ success: true, message: "Password change successfully" });
});

const addToPlaylist = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const course = await Course.findById(req.body.id);

  if (!course) return next(new ErrorHandler("Invalid Course Id", 404));
  const itemExist = user.playlist.find((item) => {
    if (item.course.toString() === course._id.toString()) return true;
  });
  if (itemExist) return next(new ErrorHandler("Item Already Exists", 409));
  user.playlist.push({
    course: course._id,
    poster: course.poster.url,
  });
  await user.save();
  return res.status(200).json({ success: true, message: "Added to playlist" });
});

const removeFromPlaylist = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const course = await Course.findById(req.query.id);

  if (!course) return next(new ErrorHandler("Invalid Course Id", 404));

  const newPlaylist = user.playlist.filter((item) => {
    if (item.course.toString() !== course._id.toString()) return item;
  });
  if (!newPlaylist) return next(new ErrorHandler("Item not found", 404));
  user.playlist = newPlaylist;
  await user.save();
  return res
    .status(200)
    .json({ success: true, message: "Remove from playlist" });
});

export {
  register,
  login,
  logout,
  getMyProfile,
  changePassword,
  updateProfile,
  updateProfilePicture,
  forgetPasssword,
  resetPassword,
  addToPlaylist,
  removeFromPlaylist,
};
