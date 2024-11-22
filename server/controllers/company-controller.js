import Company from "../models/company-model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Job from "../models/job-model.js";
import Application from "../models/application-model.js";

//Company register
export const register = async (req, res, next) => {
    try {
        const { companyName, industry, location, email, password } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            })
        }

        if (!industry) {
            return res.status(400).json({
                message: "Industry is required",
                success: false,
            });
        }

        if (!location) {
            return res.status(400).json({
                message: "Location is required",
                success: false,
            });
        }

        if (!email) {
            return res.status(400).json({
                message: "Email is required.",
                success: false
            })
        }

        if (!password) {
            return res.status(400).json({
                message: "Password is required.",
                success: false
            })
        }

        const company = await Company.findOne({ email });
        if (company) {
            return res.status(400).json({
                message: "Company already exists. Please Login",
                success: false
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await Company.create({
            companyName,
            industry,
            location,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "Company registered successfully!",
            success: true,
            company
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred during registration",
            success: false,
        });
    }
}

//Company login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Enter email and password" ,
                success: false
            })
        }

        let company = await Company.findOne({ email });
        if (!company) {
            return res.status(400).json({ message: "Invalid credentials",
                success: false
             })
        }

        const isPasswordMatch = await bcrypt.compare(password, company.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid credentials",
                suchcess: false
             })
        }

        const tokenData = {
            companyId: company._id
        }
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });

        company = {
            _id: company._id,
            companyName: company.companyName,
            email: company.email,
            industry: company.industry,
            location: company.location,
            logo: company.logo,
            description: company.description
        }
        
        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back `,
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to login",
            success: false,
        });
    }
}

//Company logout
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully!",
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to logout",
            success: false,
        });
    }
}

//Company profile update
export const updateCompanyProfile = async (req, res) => {
    try {
        const { companyName, industry, location, email, description } = req.body;
        
        let logoPath = req.files.logo ? `/uploads/logos/${req.files.logo[0].filename}` : undefined;

        const companyId = req.companyId;     //companyID from auth-middleware
        
        let company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({ message: "Company not found", success: false });
        }

        if (companyName) company.companyName = companyName;
        if (industry) company.industry = industry;
        if (location) company.location = location;
        if (email) company.email = email;
        if (description) company.description = description;
        if (logoPath) company.logo = logoPath; 

        await company.save();

        return res.status(200).json({
            message: "Company profile updated successfully",
            company: {
                _id: company._id,
                companyName: company.companyName,
                industry: company.industry,
                location: company.location,
                email: company.email,
                description: company.description,
                logo: company.logo
            },
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update profile", success: false });
    }
};

//Delete Company 
export const deleteCompany = async (req, res) => {
    try {
        const companyId = req.companyId;  //companyId from auth-middleware

        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: 'Company not found.',
                success: false,
            });
        }

        const jobs = await Job.find({ companyId });

        const jobIds = jobs.map((job) => job._id);

        await Application.deleteMany({ jobId: { $in: jobIds } });

        await Job.deleteMany({ companyId });
        
        await Company.findByIdAndDelete(companyId);

        return res.status(200).json({
            success: true,
            message: 'Company and all associated jobs have been deleted successfully.',
        });
    } catch (error) {
        console.error('Error deleting company:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while deleting the company.',
        });
    }
};