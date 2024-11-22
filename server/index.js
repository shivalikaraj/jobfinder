import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoute from "./routes/user-route.js";
import companyRoute from "./routes/company-route.js";
import jobRoute from "./routes/job-route.js";
import applicationRoute from "./routes/application-route.js";
import path from "path";

dotenv.config();

const app = express();

const allowedOrigins = [
    "http://localhost:5173", // Local development
    "https://job-finder-sr.netlify.app" // Hosted frontend on Netlify
  ];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl)
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
        credentials: true, // If cookies or authentication tokens are required
    })
);
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

const PORT = process.env.PORT || 3000;

// API's
app.use("/api/user", userRoute);
app.use("/api/company", companyRoute)
app.use("/api/job", jobRoute)
app.use("/api/application", applicationRoute)

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running at port ${PORT}`);
        });
    });