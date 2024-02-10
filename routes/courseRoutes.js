import express from "express";
import {
  getAllCourses,
  createCourse,
  getCourseLectures,
  addLecture,
  deleteCourse,
} from "../controllers/courseController.js";
import singleUpload from "../middlewares/multer.js";
import { authorizedAdmin, isAuthentication } from "../middlewares/auth.js";

const router = express.Router();

// Get all courses withour lectures
router.route("/courses").get(getAllCourses);

// Create new course only admin
router
  .route("/create-course")
  .post(isAuthentication, authorizedAdmin, singleUpload, createCourse);

// Add lecture
router
  .route("/course/:id")
  .get(isAuthentication, getCourseLectures)
  .post(isAuthentication, authorizedAdmin, singleUpload, addLecture)
  .delete(isAuthentication, authorizedAdmin, deleteCourse);

export default router;
