import express from "express";
import "dotenv/config";
import router from "./routes/router";
import { conexionDB } from "./config/db";

const app = express();

conexionDB();

// Leer datos de formularios
app.use(express.json());

app.use("/", router);

export default app;
