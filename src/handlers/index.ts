import { Request, Response } from "express";
import slug from "slug";
import Usuario from "../models/Usuario";
import { hashPassword } from "../utils/auth";
import { validationResult } from "express-validator";

export const crearUsuario = async (req: Request, res: Response) => {
  // Manejar errores
  let errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { nombreUsuario, correo, password } = req.body;

  const existeUsuario = await Usuario.findOne({
    correo,
  });

  if (existeUsuario) {
    const error = new Error("Usuario ya existe con ese correo");
    return res.status(409).json({ error: error.message });
  }

  const handle = slug(nombreUsuario, "");

  const existeNombreUsuario = await Usuario.findOne({
    nombreUsuario: handle,
  });

  if (existeNombreUsuario) {
    const error = new Error("Nombre de usuario no disponible");
    return res.status(409).json({ error: error.message });
  }

  const usuario = new Usuario(req.body);
  usuario.password = await hashPassword(password);
  usuario.nombreUsuario = handle;
  await usuario.save();
  res.status(201).send("Usuario creado");
};
