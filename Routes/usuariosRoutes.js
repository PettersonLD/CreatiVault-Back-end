import express from "express";
import { cadastrarUsuario, loginUsuario, atualizarUsuario, upload, uploadImagemPerfil, deletarImagemPerfil, criarPostagem, listarPostagens } from "../Controllers/usuariosCadastro.js";
import { homeInfo } from "../Controllers/homeController.js";
const router = express.Router();

router.post("/usuarios", cadastrarUsuario);
router.post("/login", loginUsuario);
router.get("/home", homeInfo);
router.put("/usuarios/:id", atualizarUsuario);
router.post("/usuarios/:id/imagem", upload.single("imagem_perfil"), uploadImagemPerfil);
router.delete("/usuarios/:id/imagem", deletarImagemPerfil);
router.post("/usuarios/:id/postagem", upload.single("file"), criarPostagem);
router.get("/postagens", listarPostagens);

export default router;
