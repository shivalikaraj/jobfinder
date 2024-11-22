import express from "express";
import { deleteJob, getAllJobs, getJobById, postJob } from "../controllers/job-controller.js"
import authMiddleware from "../middlewares/auth-middleware.js";
import { applyJob } from "../controllers/application-controller.js";

const router = express.Router();

router.route("/post").post(authMiddleware, postJob);
router.route("/").get(getAllJobs);
router.route("/:id").get(getJobById);
router.route("/:jobId/apply").post(authMiddleware, applyJob);
router.route("/:id/delete").delete(authMiddleware, deleteJob);

export default router;