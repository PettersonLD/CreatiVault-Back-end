import express from "express";
import cors from "cors";
import usuariosRoutes from "./routes/usuariosRoutes.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/", usuariosRoutes);

app.listen(PORT, () => {
  console.log(`Online e Roteando`);
});
