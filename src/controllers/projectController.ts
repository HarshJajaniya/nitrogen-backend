import type { Request, Response } from "express";
import { supabase } from "../supabase.js";


export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase.from("Project").select("*");
    if (error) throw error;

    const projects = data ?? [];
    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ message: `Failed to retireve project: ${error.message}` });
  }
};
export const createProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, startDate, endDate } = req.body;

    const { data, error } = await supabase
      .from("Project")
      .insert([
        {
          name,
          description,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
        },
      ])
      .select("*")
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error: any) {
    console.error("CREATE PROJECT ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};



