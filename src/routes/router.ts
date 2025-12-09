import { Router } from "express";
import {
  actualizarPerfil,
  crearUsuario,
  iniciarSesion,
  obtenerUsuario,
} from "../handlers";
import { body } from "express-validator";
import { handleInputErrores } from "../middleware/validacion";
import { autenticado } from "../middleware/auth";

const router = Router();

// Autenticacion
router.post(
  "/auth/registro",
  body("nombreUsuario")
    .notEmpty()
    .withMessage("El nombre de usuario es obligatorio"),
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
  body("correo").isEmail().withMessage("El correo no es válido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres"),
  handleInputErrores,
  crearUsuario
);

router.post(
  "/auth/iniciar-sesion",
  body("correo").isEmail().withMessage("El correo no es válido"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
  handleInputErrores,
  iniciarSesion
);

router.get("/usuario", autenticado, obtenerUsuario);
router.patch(
  "/usuario",
  body("nombreUsuario")
    .notEmpty()
    .withMessage("El nombre de usuario es obligatorio"),
  body("descripcion").notEmpty().withMessage("La descripción es obligatoria"),
  handleInputErrores,
  autenticado,
  actualizarPerfil
);

export default router;
