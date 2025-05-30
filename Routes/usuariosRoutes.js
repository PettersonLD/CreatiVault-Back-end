import express from "express";
import { cadastrarUsuario, loginUsuario } from "../Controllers/usuariosCadastro.js";
import { homeInfo } from "../Controllers/homeController.js";
const router = express.Router();

router.post("/usuarios", cadastrarUsuario);
router.post("/login", loginUsuario);
router.get("/home", homeInfo);

export default router;
