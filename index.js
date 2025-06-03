import express from "express";
import cors from "cors";
import path from "path";
import usuariosRoutes from "./Routes/usuariosRoutes.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.resolve("uploads")));
app.use("/", usuariosRoutes);

app.listen(PORT, () => {
  console.log(`Online e Roteando`);
});
