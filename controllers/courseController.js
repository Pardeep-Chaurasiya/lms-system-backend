import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Course } from "../models/Course.js";
import ErrorHandler from "../utils/errorHandler.js";

const getAllCourses = catchAsyncError(async (req, res) => {
  const courses = await Course.find().select("-lectures");
  res.status(200).json({
    success: true,
    courses,
  });
});

const createCourse = catchAsyncError(async (req, res) => {
  const { title, description, category, createdBy } = req.body;

  // const file = req.file;

  if (!title || !description || !category || !createdBy)
    return next(new ErrorHandler("Please fill all feilds", 400));

  await Course.create({
    title,
    description,
    category,
    createdBy,
    poster: {
      public_id: "temp",
      url: "temp",
    },
  });
  res.status(201).json({
    success: true,
    message: "Course Created Successfully",
  });
});

export { getAllCourses, createCourse };
