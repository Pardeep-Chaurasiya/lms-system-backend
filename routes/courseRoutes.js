import express from "express";
import {
  getAllCourses,
  createCourse,
  getCourseLectures,
  addLecture,
} from "../controllers/courseController.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

// Get all courses withour lectures
router.route("/courses").get(getAllCourses);

// Create new course only admin
router.route("/create-course").post(singleUpload, createCourse);

// Add lecture
router
  .route("/course/:id")
  .get(getCourseLectures)
  .post(singleUpload, addLecture);

export default router;
