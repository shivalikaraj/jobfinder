import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        default: "Pending"
    },
    dateSubmitted: {
        type: Date,
        default: Date.now
    }
}, {timestamps: true});

const Application = mongoose.model("Application", applicationSchema);

export default Application;