import express from "express";
import { register, login, logout, updateProfile, deleteUser } from "../controllers/user-controller.js";
import { upload } from "../middlewares/multer-config.js";
import authMiddleware from "../middlewares/auth-middleware.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").put(authMiddleware, upload, updateProfile);
router.route("/delete").delete(authMiddleware, deleteUser);

export default router;