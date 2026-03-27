import { prisma } from "../../../src/prisma";

export async function GET() {
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

        return Response.json(teamsWithUsernames);
    } catch (error) {
        console.error("getTeams error:", error);
        return Response.json({ message: "Failed to retrieve Teams" }, { status: 500 });
    }
}
