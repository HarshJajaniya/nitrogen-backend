import type { Request, Response } from "express";
import { supabase } from "../supabase.js";


export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.query;
  try {
    const { data, error } = await supabase.from("User").select("*");
    if (error) throw error;

    const users = data ?? [];
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: `Failed to retireve users: ${error.message}` });
  }
};
export const getUser = async (req: Request, res: Response): Promise<void> => {
  const rawCognitoId = req.params.cognitoId;
  const cognitoId = Array.isArray(rawCognitoId)
    ? rawCognitoId[0]
    : rawCognitoId;

  if (!cognitoId) {
    res.status(400).json({ message: "cognitoId is required" });
    return;
  }

  try {
    const { data: user, error } = await supabase
      .from("User")
      .select("*")
      .eq("cognitoId", cognitoId)
      .maybeSingle();

    if (error) throw error;

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: `Failed to retireve user: ${error.message}` });
  }
};

export const postUser = async (req: Request, res: Response) => {
  try {
    const {
      username,
      cognitoId,
      profilePictureUrl = "i1.jpeg",
      teamId = 1,
    } = req.body;

    const { data, error } = await supabase
      .from("User")
      .insert([
        {
          username,
          cognitoId,
          profilePictureUrl,
          teamId,
        },
      ])
      .select("*")
      .single();

    if (error) throw error;

    res.json({
      message: "User created successfully",
      newUser: data,
    });
  } catch (error: any) {
    res.status(500).json({
      message: `Failed to create user: ${error.message}`,
    });
  }
};
