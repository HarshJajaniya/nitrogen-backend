import serverless from "serverless-http";
let cachedHandler: ReturnType<typeof serverless> | null = null;

export default async function handler(req: any, res: any) {
    try {
        if (!cachedHandler) {
            console.log("SUPABASE_URL present:", Boolean(process.env.SUPABASE_URL));
            console.log(
                "SUPABASE_SERVICE_ROLE_KEY present:",
                Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
            );

            const { default: app } = await import("../src/app");
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