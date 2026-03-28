import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";

export async function GET() {
    try {
        const supabaseAdmin = getSupabaseAdmin();
        const { data: teamsData, error: teamsError } = await supabaseAdmin
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
            ? await supabaseAdmin
                .from("User")
                .select("userId,username")
                .in("userId", ownerAndManagerIds)
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

        return Response.json(teamsWithUsernames);
    } catch (error) {
        console.error("getTeams error:", error);
        return Response.json({ message: "Failed to retrieve Teams" }, { status: 500 });
    }
}
