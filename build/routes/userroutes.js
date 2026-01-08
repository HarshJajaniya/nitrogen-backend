import { Router } from "express";
import { getUsers, postUser, getUser } from "../controllers/userController.js";
const tasksroutes = Router();
tasksroutes.get("/", getUsers);
tasksroutes.post("/", postUser);
tasksroutes.get("/:cognitoId", getUser);
export default tasksroutes;
