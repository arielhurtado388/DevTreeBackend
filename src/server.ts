import express from "express";
import cors from "cors";
import "dotenv/config";
import router from "./routes/router";
import { conexionDB } from "./config/db";
import { corsConfig } from "./config/cors";

conexionDB();

const app = express();

// Cors
app.use(cors(corsConfig));

// Leer datos de formularios
app.use(express.json());

app.use("/", router);

export default app;
