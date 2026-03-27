import type { Request, Response } from "express";
import { supabase } from "../supabase.js";


export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: teamsData, error: teamsError } = await supabase
      .from("Team")
      .select("*");

    if (teamsError) throw teamsError;

    const teams = teamsData ?? [];
    const ownerAndManagerIds = [
      ...new Set(
        teams
          .flatMap((team: any) => [team.productOwnerUserId, team.productManagerUserId])
          .filter(Boolean)
      ),
    ];

    const { data: usersData, error: usersError } = ownerAndManagerIds.length
      ? await supabase.from("User").select("userId,username").in("userId", ownerAndManagerIds)
      : { data: [], error: null };

    if (usersError) throw usersError;

    const usersById = new Map((usersData ?? []).map((user: any) => [user.userId, user.username]));

    const teamsWithUsernames = teams.map((team: any) => ({
      ...team,
      productOwnerUsername:
        team.productOwnerUserId != null
          ? usersById.get(team.productOwnerUserId) ?? null
          : null,
      productManagerUsername:
        team.productManagerUserId != null
          ? usersById.get(team.productManagerUserId) ?? null
          : null,
    }));

    res.json(teamsWithUsernames);
  } catch (error) {
    console.error("getTeams error:", error);
    res.status(500).json({
      message: "Failed to retrieve Teams",
    });
  }
};
