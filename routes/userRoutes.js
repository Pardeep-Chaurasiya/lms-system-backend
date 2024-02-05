import express from "express";
import { register, login, logout } from "../controllers/userController.js";

const router = express.Router();

// Register new User
router.route("/register").post(register);

// Login
router.route("/login").post(login);

// loggout
router.route("/logout").get(logout);

export default router;
