import { Course } from "../models/Course.js";

const getAllCourses = async (req, res) => {
  const courses = await Course.find();
  res.status(200).json({
    success: true,
    courses,
  });
};

export { getAllCourses };
