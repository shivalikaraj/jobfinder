import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    logo: {
        type: String,
        default: ""
    }
}, {timestamps: true});

const Company = mongoose.model("Company", companySchema);

export default Company;