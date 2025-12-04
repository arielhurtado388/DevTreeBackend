import { Router } from "express";
import { crearUsuario, iniciarSesion } from "../handlers";
import { body } from "express-validator";
import { handleInputErrores } from "../middleware/validacion";

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

export default router;
