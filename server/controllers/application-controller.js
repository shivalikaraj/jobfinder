import Application from "../models/application-model.js";
import Job from "../models/job-model.js";

//Apply job
export const applyJob = async (req, res) => {
    const jobId = req.params.jobId;   //jobId from params
    const userId = req.userId;        //userID from auth-middleware

    if (!userId) {
        console.log(userId)
        return res.status(401).json({ success: false, message: "Only users can apply for jobs." });
    }

    try {
        const existingApplication = await Application.findOne({ jobId, userId });
        if (existingApplication) {
            return res.status(400).json({ success: false, message: "You have already applied for this job." });
        }


        const application = await Application.create({ jobId, userId });

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found." });
        }

        job.applications.push(application._id); //adding application to job model under applicationId field
        await job.save();

        return res.status(201).json({
            success: true,
            message: "Job application submitted successfully!",
            application
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while applying for the job."
        });
    }
};

//Get applied jobs by user
export const getAppliedJobs = async (req, res) => {
    const userId = req.userId;   //userId from auth-middleware

    if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try {
        const applications = await Application.find({ userId })
            .populate({
                path: "jobId",
                select: "jobTitle companyId",
                populate: {
                    path: "companyId",
                    select: "companyName",
                },
            });

        if (!applications.length) {
            return res.status(404).json({ success: false, message: "No applications found." });
        }

        res.status(200).json({ success: true, applications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

//Get applicants for the job
export const getApplicantsByJob = async (req, res) => {
    const { jobId } = req.params; 

    try {
        const applications = await Application.find({ jobId })
            .populate("userId");

        if (!applications || applications.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No applicants found for this job",
            });
        }

        res.status(200).json({
            success: true,
            applications,
        });
    } catch (error) {
        console.error("Error fetching applicants:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch applicants",
            error: error.message,
        });
    }
};

//Updating application status for user
export const updateStatus = async (req,res) => {
    try {
        const {status} = req.body;
        const applicationId = req.params.id;

        if(!status){
            return res.status(400).json({
                message:'status is required',
                success:false
            })
        };

        const statusMap = {
            Accept: 'Accepted',
            Reject: 'Rejected',
        };

        const mappedStatus = statusMap[status];

        const application = await Application.findOne({_id:applicationId});

        if(!application){
            return res.status(404).json({
                message:"Application not found.",
                success:false
            })
        };

        application.status = mappedStatus;
        await application.save();

        return res.status(200).json({
            message:"Status updated successfully.",
            success:true
        });

    } catch (error) {
        console.log(error);
    }
}