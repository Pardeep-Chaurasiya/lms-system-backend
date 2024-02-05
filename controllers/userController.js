import { User } from "../models/User.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";

const register = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  // const file =  req.file;

  if (!name || !email || !password)
    return next(new ErrorHandler("Please fill all feilds", 400));

  let user = await User.findOne({ email });

  if (user)
    return next(ErrorHandler("User already exist with this email", 409));

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

  const isMatch = await user.comparePassword();
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

export { register, login, logout };
