import { Router } from "express";
import { getProjects } from "../controllers/projectController.js";
import { createProjects } from "../controllers/projectController.js";
const projectroutes = Router();
projectroutes.get("/", getProjects);
projectroutes.post("/", createProjects);
export default projectroutes;
