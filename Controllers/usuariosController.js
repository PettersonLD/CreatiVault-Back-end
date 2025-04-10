import conexao from "../Database/conexao.js";

export async function cadastrarUsuario(req, res) {
  const { nome, email, telefone, senha } = req.body;

  if (!nome || !email || !telefone || !senha) {
    return res.status(400).json({ mensagem: "Preencha todos os campos!" });
  }

  try {
    const db = await conexao.bancoDados();
    const sql = "INSERT INTO usuarios (nome, email, telefone, senha) VALUES (?, ?, ?, ?)";
    await db.execute(sql, [nome, email, telefone, senha]);
    res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
  } catch (erro) {
    console.error("Erro ao cadastrar:", erro);
    res.status(500).json({ mensagem: "Erro ao salvar no banco de dados." });
  }
}
