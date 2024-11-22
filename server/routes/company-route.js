import express from "express";
import { register, login, logout, updateCompanyProfile, deleteCompany } from "../controllers/company-controller.js";
import authMiddleware from "../middlewares/auth-middleware.js";
import { upload } from "../middlewares/multer-config.js"
import { getJobByCompany } from "../controllers/job-controller.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").put(authMiddleware, upload, updateCompanyProfile);
router.route("/:companyId").get(authMiddleware, getJobByCompany);
router.route("/delete").delete(authMiddleware,deleteCompany);

export default router;