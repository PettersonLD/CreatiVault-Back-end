import conexao from "../Database/conexao.js";

export async function cadastrarUsuario(req, res) {
  const { nome, email, telefone, senha } = req.body;

  if (!nome || !email || !telefone || !senha) {
    return res.status(400).json({ mensagem: "Preencha todos os campos!" });
  }

  try {
    const db = await conexao.bancoDados();
    // Verifica se o e-mail já está cadastrado
    const [usuariosExistentes] = await db.execute("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (usuariosExistentes.length > 0) {
      return res.status(409).json({ mensagem: "E-mail já cadastrado!" });
    }
    const sql = "INSERT INTO usuarios (nome, email, telefone, senha) VALUES (?, ?, ?, ?)";
    await db.execute(sql, [nome, email, telefone, senha]);
    res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
  } catch (erro) {
    console.error("Erro ao cadastrar:", erro);
    res.status(500).json({ mensagem: "Erro ao salvar no banco de dados." });
  }
} 

export async function loginUsuario(req, res) {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ mensagem: "Preencha email e senha!" });
  }
  try {
    const db = await conexao.bancoDados();
    const sql = "SELECT * FROM usuarios WHERE email = ? AND senha = ?";
    const [usuarios] = await db.execute(sql, [email, senha]);
    if (usuarios.length === 0) {
      return res.status(401).json({ mensagem: "E-mail ou senha inválidos!" });
    }
    res.status(200).json({ mensagem: "Login realizado com sucesso!", usuario: usuarios[0] });
  } catch (erro) {
    console.error("Erro ao fazer login:", erro);
    res.status(500).json({ mensagem: "Erro ao acessar o banco de dados." });
  }
}
