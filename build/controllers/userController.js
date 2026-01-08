import { prisma } from "../lib/prisma.js";
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
export const postUser = async (req, res) => {
    try {
        const { username, cognitoId, profilePictureUrl = "i1.jpeg", teamId = 1, } = req.body;
        const Newuser = await prisma.user.create({
            data: {
                username,
                cognitoId,
                profilePictureUrl,
                teamId
            }
        });
        res.json({ message: "User Created with name", Newuser });
    }
    catch (error) {
        res.status(500).json({ message: `Failed to retireve users: ${error.message}` });
    }
};
