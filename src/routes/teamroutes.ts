import { Router } from "express";
import { getTeams } from "../controllers/teamController.js";

const teamroutes = Router();

teamroutes.get("/", getTeams);

export default teamroutes;