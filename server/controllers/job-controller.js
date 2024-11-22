import Application from "../models/application-model.js";
import Job from "../models/job-model.js";

//Posting a new job
export const postJob = async (req, res) => {
    try {
        const { jobTitle, jobType, location, salary, jobDescription, requirement } = req.body;

        const companyId = req.companyId;     //companyId from auth-middleware

        if (!companyId) {
            return res.status(403).json({
                message: "Unauthorized access. Company ID not found.",
                success: false,
            });
        }

        if (!jobTitle || !jobType || !location || !salary || !jobDescription || !requirement) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        const newJob = await Job.create({
            jobTitle,
            jobType,
            location,
            salary,
            jobDescription,
            requirement,
            companyId,
        });

        res.status(201).json({
            message: "Job posted successfully",
            success: true,
            job: newJob,
        });
    } catch (error) {
        console.error("Error in postJob:", error);
        res.status(500).json({
            message: "Something went wrong",
            success: false,
        });
    }
};


//Get all the jobs in database or as per query
export const getAllJobs = async (req, res) => {
    try {
        const { keyword } = req.query || "";

        // query object
        const query = keyword
            ? {
                $or: [
                    { jobTitle: { $regex: keyword, $options: "i" } },
                    { jobDescription: { $regex: keyword, $options: "i" } },
                    { jobType: { $regex: keyword, $options: "i" } },
                    { location: { $regex: keyword, $options: "i" } },
                    { "companyId.industry": { $regex: keyword, $options: "i" } }
                ],
            }
            : {};

        const jobs = await Job.find(query)
            .populate('companyId')
            .sort({ createdAt: -1 })

        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };

        res.status(200).json({
            success: true,
            jobs,
        });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch jobs",
        });
    }
};

//Get job by jobId
export const getJobById = async (req, res) => {
    try {
        const { id } = req.params;        //jobId from params
        const job = await Job.findById(id)
            .populate({
                path: "applications",
            })
            .populate({
                path: "companyId",
            });

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        res.status(200).json({ success: true, job });
    } catch (error) {
        console.error('Error fetching job by ID:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

//Get company's jobs
export const getJobByCompany = async (req, res) => {
    const { companyId } = req.params;  //companyId from params

    try {
        const jobs = await Job.find({ companyId })
            .populate('applications')
            .populate('companyId');

        if (!jobs.length) {
            return res.status(404).json({ success: false, message: 'No jobs found for this company.' });
        }

        res.status(200).json({ success: true, jobs });
    } catch (error) {
        console.error("Error fetching jobs by company:", error);
        res.status(500).json({ success: false, message: 'Failed to fetch jobs', error });
    }
};

//Delete job
export const deleteJob = async (req, res) => {
    const id = req.params.id;         //jobId from params
    const companyId = req.companyId;  //companyId from auth-middleware

    try {
        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        if (job.companyId != companyId) {
            return res.status(403).json({ success: false, message: "You are not authorized to delete this job" });
        }

        await Application.deleteMany({ jobId: id });

        await Job.findByIdAndDelete(id);

        return res.status(200).json({ success: true, message: "Job deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "An error occurred while deleting the job" });
    }
};