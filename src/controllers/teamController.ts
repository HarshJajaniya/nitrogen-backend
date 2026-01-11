import type { Request, Response } from "express";
import { prisma } from "../prisma.js";


export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const teams = await prisma.team.findMany();

    const teamsWithUsernames = await Promise.all(
      teams.map(async (team: any) => {
        let productOwnerUsername = null;
        let productManagerUsername = null;

        if (team.productOwnerUserId != null) {
          const productOwner = await prisma.user.findUnique({
            where: { userId: team.productOwnerUserId },
            select: { username: true },
          });
          productOwnerUsername = productOwner?.username ?? null;
        }

        if (team.productManagerUserId != null) {
          const productManager = await prisma.user.findUnique({
            where: { userId: team.productManagerUserId },
            select: { username: true },
          });
          productManagerUsername = productManager?.username ?? null;
        }

        return {
          ...team,
          productOwnerUsername,
          productManagerUsername,
        };
      })
    );

    res.json(teamsWithUsernames);
  } catch (error) {
    console.error("getTeams error:", error);
    res.status(500).json({
      message: "Failed to retrieve Teams",
    });
  }
};
