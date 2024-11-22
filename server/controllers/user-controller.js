import User from "../models/user-model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Application from "../models/application-model.js";

//User registration
export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;
        if (!firstName) {
            return res.status(400).json({
                message: "First name is required",
                success: false
            })
        }

        if (!lastName) {
            return res.status(400).json({
                message: "Last name is required",
                success: false
            })
        }

        if (!email) {
            return res.status(400).json({
                message: "Email is required",
                success: false
            })
        }

        if (!phone) {
            return res.status(400).json({
                message: "Phone number is required",
                success: false,
            });
        }

        if (!password) {
            return res.status(400).json({
                message: "Password is required",
                success: false
            })
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "Email already exists",
                success: false
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "Signup successfully!",
            success: true
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred during registration",
            success: false,
        });
    }
}

//User login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Enter email and password",
                success: false
            })
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials",
                success: false
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid credentials",
                success: false
            })
        }

        const tokenData = {
            userId: user._id
        }
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });

        user = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            skills: user.skills,
            profile: user.profile,
            resume: user.resume
        }
        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.firstName} `,
            user,
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

//User logout
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

//Update profile
export const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, skills } = req.body;

        let profilePath, resumePath;
        if (req.files) {
            // If profile picture uploaded
            if (req.files.profile) {
                profilePath = `/uploads/profiles/${req.files.profile[0].filename}`;
            }
            // If resume uploaded
            if (req.files.resume) {
                resumePath = `/uploads/resumes/${req.files.resume[0].filename}`;
            }
        }

        const userId = req.userId;    // userId from auth-middleware
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (skills) user.skills = skills.split(",");

        if (profilePath) user.profile = profilePath;
        if (resumePath) user.resume = resumePath;

        await user.save();

        const updatedUser = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            skills: user.skills,
            profile: user.profile,
            resume: user.resume
        };

        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update profile", success: false });
    }
};

//Delete user account 
export const deleteUser = async (req, res) => {
    try {
        const  userId  = req.userId;   //userId from auth-middleware

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false,
            });
        }

        await Application.deleteMany({ userId });

        await User.findByIdAndDelete(userId);

        return res.status(200).json({
            message: "Account deleted successfully.",
            success: true,
        });

    } catch (error) {
        console.log("Error deleting account:", error);
        return res.status(500).json({
            message: "An error occurred while deleting the account.",
            success: false,
        });
    }
};