import { prisma } from "../prisma.js";
export const getUsers = async (req, res) => {
    const { projectId } = req.query;
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: `Failed to retireve users: ${error.message}` });
    }
};
export const getUser = async (req, res) => {
    const { cognitoId } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { cognitoId: cognitoId }
        });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: `Failed to retireve user: ${error.message}` });
    }
};
export const postUser = async (req, res) => {
    try {
        const { username, cognitoId, profilePictureUrl = "i1.jpeg", teamId = 1, } = req.body;
        const newUser = await prisma.user.create({
            data: {
                username,
                cognitoId,
                profilePictureUrl,
                teamId,
            },
        });
        res.json({
            message: "User created successfully",
            newUser,
        });
    }
    catch (error) {
        res.status(500).json({
            message: `Failed to create user: ${error.message}`,
        });
    }
};
