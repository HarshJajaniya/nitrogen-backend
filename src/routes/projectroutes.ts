import { Router } from "express";
import { getProjects } from "../controllers/projectController";
import { createProjects } from "../controllers/projectController";

const projectroutes = Router();

projectroutes.get("/", getProjects);
projectroutes.post("/", createProjects);
export default projectroutes;