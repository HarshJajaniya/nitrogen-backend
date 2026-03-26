import "./prisma.js";
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { createRequire } from "module";
import morgan from "morgan";
/* ROUTE IMPORTS */
import projectRoutes from "./routes/projectroutes.js";
import taskRoutes from "./routes/tasksroutes.js";
import searchRoutes from "./routes/seacrhroutes.js";
import userRoutes from "./routes/userroutes.js";
import teamRoutes from "./routes/teamroutes.js";
dotenv.config();
const require = createRequire(import.meta.url);
const helmet = require("helmet");
const app = express();
/* MIDDLEWARE */
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
/* ROUTES */
app.get("/", (req, res) => {
    res.send("API is running...");
});
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/search", searchRoutes);
app.use("/users", userRoutes);
app.use("/teams", teamRoutes);
export default app;
