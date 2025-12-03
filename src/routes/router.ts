import { Router } from "express";

const router = Router();

// Autenticacion
router.post("/auth/registro", (req, res) => {
  console.log(req.body);
});

export default router;
