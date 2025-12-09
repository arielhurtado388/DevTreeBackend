import { Request, Response } from "express";
import slug from "slug";
import Usuario from "../models/Usuario";
import { hashPassword, verificarPasswords } from "../utils/auth";
import { generarJWT } from "../utils/jwt";

export const crearUsuario = async (req: Request, res: Response) => {
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

export const iniciarSesion = async (req: Request, res: Response) => {
  const { correo, password } = req.body;

  const usuario = await Usuario.findOne({
    correo,
  });

  if (!usuario) {
    const error = new Error("Usuario no existe");
    return res.status(404).json({ error: error.message });
  }

  const verificarPass = await verificarPasswords(password, usuario.password);

  if (!verificarPass) {
    const error = new Error("Contraseña incorrecta");
    return res.status(401).json({ error: error.message });
  }

  // Generar JWT
  const token = generarJWT({ id: usuario._id });
  res.send(token);
};

export const obtenerUsuario = async (req: Request, res: Response) => {
  res.json(req.usuario);
};
