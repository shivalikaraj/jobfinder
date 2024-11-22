import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            });
        }

        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if (!decode) {
            return res.status(401).json({
                message: "Invalid token",
                success: false,
            });
        }

        // Check if token is for a user or a company
        if (decode.userId) {
            req.userId = decode.userId;
        } else if (decode.companyId) {
            req.companyId = decode.companyId;
        } else {
            return res.status(401).json({
                message: "Invalid token payload",
                success: false,
            });
        }

        next();
    } catch (error) {
        console.log("Authentication error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export default authMiddleware;