import serverless from "serverless-http";
import app from "../src/app";

const cachedHandler = serverless(app);

export default async function handler(req: any, res: any) {
    try {
        return cachedHandler(req, res);
    } catch (error) {
        console.error("Server initialization failed:", error);
        return res.status(500).json({
            error: "Server initialization failed",
        });
    }
}