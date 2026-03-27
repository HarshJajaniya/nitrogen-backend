import { supabaseAdmin } from "../lib/supabaseAdmin";

export default async function handler(req: any, res: any) {
    try {
        const { data, error } = await supabaseAdmin.from("users").select("*");

        if (error) throw error;

        return res.status(200).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
}
