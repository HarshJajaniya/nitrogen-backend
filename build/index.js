import "./prisma.js"; // 👈 REQUIRED: initialize Prisma once
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
/* ROUTE IMPORTS */
import projectRoutes from "./routes/projectroutes.js";
import taskRoutes from "./routes/tasksroutes.js";
import searchRoutes from "./routes/seacrhroutes.js";
import userRoutes from "./routes/userroutes.js";
import teamRoutes from "./routes/teamroutes.js";
/* CONFIG */
dotenv.config();
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
/* SERVER */
export const handler = serverless(app);
