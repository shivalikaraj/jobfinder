import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true
    },
    location: {
        type: String,
        requiried: true
    },
    salary: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    requirement: {
        type: String,
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application'
    }]
}, {timestamps: true});

const Job = mongoose.model("Job", jobSchema)

export default Job;