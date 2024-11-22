import multer from "multer";
import path from "path";
import fs from "fs";

// Main upload directory
const uploadDir = path.join(process.cwd(), "uploads");

// Subdirectories for resumes, profiles (user images), and logos (company images)
const resumeDir = path.join(uploadDir, "resumes");
const profileDir = path.join(uploadDir, "profiles");
const logoDir = path.join(uploadDir, "logos");

// Create directories if they don't exist
if (!fs.existsSync(resumeDir)) {
    fs.mkdirSync(resumeDir, { recursive: true });
}

if (!fs.existsSync(profileDir)) {
    fs.mkdirSync(profileDir, { recursive: true });
}

if (!fs.existsSync(logoDir)) {
    fs.mkdirSync(logoDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Set destination based on field name
        if (file.fieldname === "resume") {
            cb(null, resumeDir);
        } else if (file.fieldname === "profile") {
            cb(null, profileDir);
        } else if (file.fieldname === "logo") {
            cb(null, logoDir);
        } else {
            cb(new Error("Invalid field name. Only 'resume', 'profile', and 'logo' are allowed."), false);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname); // Extract file extension
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});

// File filter to allow only certain file types
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPEG, PNG, and PDF are allowed."), false);
    }
};

// Export the multer instance configured for multiple fields
export const upload = multer({ storage, fileFilter }).fields([
    { name: "resume", maxCount: 1 },
    { name: "profile", maxCount: 1 },
    { name: "logo", maxCount: 1 }
]);