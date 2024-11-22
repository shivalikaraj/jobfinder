import express from 'express';
import {  getApplicantsByJob, getAppliedJobs, updateStatus } from '../controllers/application-controller.js';
import authMiddleware from '../middlewares/auth-middleware.js';

const router = express.Router();

router.route('/applied-jobs').get(authMiddleware, getAppliedJobs);
router.route('/:jobId/applicants').get(authMiddleware, getApplicantsByJob);
router.route("/status/:id/update").put(authMiddleware, updateStatus);

export default router;