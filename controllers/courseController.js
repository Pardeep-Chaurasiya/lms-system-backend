import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Course } from "../models/Course.js";
import getDataUri from "../utils/daraUri.js";
import ErrorHandler from "../utils/errorHandler.js";
import cloudnairy from "cloudinary";

const getAllCourses = catchAsyncError(async (req, res) => {
  const courses = await Course.find().select("-lectures");
  res.status(200).json({
    success: true,
    courses,
  });
});

const createCourse = catchAsyncError(async (req, res) => {
  const { title, description, category, createdBy } = req.body;

  const file = req.file;

  const fileUri = getDataUri(file);

  const mycloud = await cloudnairy.v2.uploader.upload(fileUri.content);
  if (!title || !description || !category || !createdBy)
    return next(new ErrorHandler("Please fill all feilds", 400));

  await Course.create({
    title,
    description,
    category,
    createdBy,
    poster: {
      public_id: mycloud.public_id,
      url: mycloud.url,
    },
  });
  res.status(201).json({
    success: true,
    message: "Course Created Successfully",
  });
});

const getCourseLectures = catchAsyncError(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) return next(new ErrorHandler("Course not found", 404));

  course.views += 1;
  await course.save();
  res.status(200).json({
    success: true,
    lectures: course.lectures,
  });
});

const addLecture = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const course = await Course.findById(id);

  if (!course) return next(new ErrorHandler("Course not found", 404));

  const file = req.file;

  const fileUri = getDataUri(file);

  const mycloud = await cloudnairy.v2.uploader.upload(fileUri.content, {
    resource_type: "video",
  });

  course.lectures.push({
    title,
    description,
    video: {
      public_id: mycloud.public_id,
      url: mycloud.url,
    },
  });
  course.numOfVideos = course.lectures.length;
  await course.save();
  res.status(200).json({
    success: true,
    message: "Lecture added in Course",
  });
});

const deleteCourse = catchAsyncError(async (req, res) => {
  const { id } = req.params;

  const course = await Course.findById(id);
  console.log(course);

  if (!course) return next(new ErrorHandler("Course not found", 404));

  await cloudnairy.v2.uploader.destroy(course.poster.public_id);

  for (let i = 0; i < course.lectures.length; i++) {
    const singleLecture = course.lectures[i];
    await cloudnairy.v2.uploader.destroy(singleLecture.video.public_id, {
      resource_type: "video",
    });
  }
  await course.remove();
  res.status(200).json({
    success: true,
    message: "Course deleted Successfully",
  });
});
export {
  getAllCourses,
  createCourse,
  getCourseLectures,
  addLecture,
  deleteCourse,
};
