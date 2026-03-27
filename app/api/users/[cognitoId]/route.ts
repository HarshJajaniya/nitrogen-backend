import { prisma } from "../../../../src/prisma";

export async function GET(
    _request: Request,
    { params }: { params: { cognitoId: string } }
) {
    try {
        const user = await prisma.user.findUnique({
            where: { cognitoId: params.cognitoId },
        });
        return Response.json(user);
    } catch (error: any) {
        return Response.json(
            { message: `Failed to retireve user: ${error.message}` },
            { status: 500 }
        );
    }
}
