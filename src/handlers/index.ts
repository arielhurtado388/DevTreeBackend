import { Request, Response } from "express";
import slug from "slug";
import formidable from "formidable";
import { v4 as uuidv4 } from "uuid";
import Usuario from "../models/Usuario";
import { hashPassword, verificarPasswords } from "../utils/auth";
import { generarJWT } from "../utils/jwt";
import cloudinary from "../config/cloudinary";

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

export const actualizarPerfil = async (req: Request, res: Response) => {
  try {
    const { nombreUsuario, descripcion } = req.body;

    const handle = slug(nombreUsuario, "");

    const existeNombreUsuario = await Usuario.findOne({
      nombreUsuario: handle,
    });

    if (
      existeNombreUsuario &&
      existeNombreUsuario.correo !== req.usuario.correo
    ) {
      const error = new Error("Nombre de usuario no disponible");
      return res.status(409).json({ error: error.message });
    }

    // Actualizar el usuario
    req.usuario.descripcion = descripcion;
    req.usuario.nombreUsuario = handle;
    await req.usuario.save();
    res.send("Perfil actualizado");
  } catch (e) {
    const error = new Error("Hubo un error");
    return res.status(500).json({ error: error.message });
  }
};

export const subirImagen = async (req: Request, res: Response) => {
  const form = formidable({
    multiples: false,
  });

  try {
    form.parse(req, (error, fields, files) => {
      cloudinary.uploader.upload(
        files.file[0].filepath,
        { public_id: uuidv4() },
        async function (error, result) {
          if (error) {
            const error = new Error("Hubo un error al subir la imagen");
            return res.status(500).json({ error: error.message });
          }
          if (result) {
            req.usuario.imagen = result.secure_url;
            await req.usuario.save();
            res.json({ imagen: result.secure_url });
          }
        }
      );
    });
  } catch (e) {
    const error = new Error("Hubo un error");
    return res.status(500).json({ error: error.message });
  }
};
