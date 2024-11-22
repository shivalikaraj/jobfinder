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

const corsOptions = {
    origin: "https://job-finder-sr.netlify.app",
    credentials: true
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

const PORT = process.env.PORT || 3000;

// API's
app.use("/api/user", userRoute);
app.use("/api/company", companyRoute)
app.use("/api/job",jobRoute)
app.use("/api/application", applicationRoute)

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running at port ${PORT}`);
        });
    });