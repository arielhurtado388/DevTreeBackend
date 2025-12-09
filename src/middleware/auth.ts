import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Usuario, { IUsuario } from "../models/Usuario";

declare global {
  namespace Express {
    interface Request {
      usuario?: IUsuario;
    }
  }
}

export const autenticado = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization;
  if (!bearer) {
    const error = new Error("No autorizado");
    return res.status(401).json({ error: error.message });
  }

  const [, token] = bearer.split(" ");
  if (!token) {
    const error = new Error("No autorizado");
    return res.status(401).json({ error: error.message });
  }

  try {
    const resultado = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof resultado === "object" && resultado.id) {
      const usuario = await Usuario.findById(resultado.id).select("-password");
      if (!usuario) {
        const error = new Error("Usuario no existe");
        return res.status(404).json({ error: error.message });
      }
      req.usuario = usuario;
      next();
    }
  } catch (error) {
    res.status(500).json({ error: "Token no válido" });
  }
};
