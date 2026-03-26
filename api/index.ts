import serverless from "serverless-http";

let cachedHandler: ReturnType<typeof serverless> | null = null;

export default async function handler(req: any, res: any) {
    try {
        if (!cachedHandler) {
            const { default: app } = await import("../src/app.js");
            cachedHandler = serverless(app);
        }

        return cachedHandler(req, res);
    } catch (error) {
        console.error("Server initialization failed:", error);
        return res.status(500).json({
            error: "Server initialization failed",
        });
    }
}