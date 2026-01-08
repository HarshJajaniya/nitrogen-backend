import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import projectroutes from "./routes/projectroutes.js";
import tasksroutes from "./routes/tasksroutes.js";
import { Router } from "express";
import searchroutes from "./routes/seacrhroutes.js";
import userroutes from "./routes/userroutes.js";
import teamroutes from "./routes/teamroutes.js";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const app = express();


app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// ROUTES
app.get("/", (req, res) => {
  res.send("API is running...");
});

const prisma = new PrismaClient();

app.use("/projects", projectroutes);
app.use("/tasks",tasksroutes);
app.use("/search",searchroutes);
app.use("/users",userroutes);
app.use("/teams",teamroutes);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


