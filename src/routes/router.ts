import { Router } from "express";
import { crearUsuario } from "../handlers";
import { body } from "express-validator";

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
  crearUsuario
);

export default router;
