import { Router } from "express";

import { getUsers } from "../controllers/userController.js";

const tasksroutes = Router();

tasksroutes.get("/", getUsers);

export default tasksroutes;