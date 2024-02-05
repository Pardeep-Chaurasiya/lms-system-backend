import express from "express";
import {
  getAllCourses,
  createCourse,
} from "../controllers/courseController.js";

const router = express.Router();

// Get all courses withour lectures
router.route("/courses").get(getAllCourses);

// Create new course only admin
router.route("/create-course").post(createCourse);

export default router;
