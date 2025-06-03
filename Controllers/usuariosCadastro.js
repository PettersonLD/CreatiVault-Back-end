import conexao from "../Database/conexao.js";
import multer from "multer";
import path from "path";

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

export async function atualizarUsuario(req, res) {
  const { id } = req.params;
  const { nome, email, telefone, senha } = req.body;
  if (!nome && !email && !telefone && !senha) {
    return res.status(400).json({ mensagem: "Envie ao menos um campo para atualizar." });
  }
  try {
    const db = await conexao.bancoDados();
    // Monta dinamicamente os campos a serem atualizados
    const campos = [];
    const valores = [];
    if (nome) { campos.push("nome = ?"); valores.push(nome); }
    if (email) { campos.push("email = ?"); valores.push(email); }
    if (telefone) { campos.push("telefone = ?"); valores.push(telefone); }
    if (senha) { campos.push("senha = ?"); valores.push(senha); }
    if (campos.length === 0) {
      return res.status(400).json({ mensagem: "Nenhum campo válido para atualizar." });
    }
    valores.push(id);
    const sql = `UPDATE usuarios SET ${campos.join(", ")} WHERE id_usuario = ?`;
    await db.execute(sql, valores);
    res.status(200).json({ mensagem: "Dados atualizados com sucesso!" });
  } catch (erro) {
    console.error("Erro ao atualizar usuário:", erro);
    res.status(500).json({ mensagem: "Erro ao atualizar usuário." });
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `perfil_${Date.now()}${path.extname(file.originalname)}`);
  }
});
export const upload = multer({ storage });

export async function uploadImagemPerfil(req, res) {
  const { id } = req.params;
  if (!req.file) {
    return res.status(400).json({ mensagem: "Nenhuma imagem enviada." });
  }
  try {
    const db = await conexao.bancoDados();
    const caminho = req.file.path.replace(/\\/g, "/");
    await db.execute("UPDATE usuarios SET imagem_perfil = ? WHERE id_usuario = ?", [caminho, id]);
    res.status(200).json({ mensagem: "Imagem de perfil atualizada!", imagem_perfil: caminho });
  } catch (erro) {
    console.error("Erro ao salvar imagem:", erro);
    res.status(500).json({ mensagem: "Erro ao salvar imagem de perfil." });
  }
}

export async function deletarImagemPerfil(req, res) {
  const { id } = req.params;
  try {
    const db = await conexao.bancoDados();
    // Busca o caminho da imagem atual
    const [usuarios] = await db.execute("SELECT imagem_perfil FROM usuarios WHERE id_usuario = ?", [id]);
    if (!usuarios.length || !usuarios[0].imagem_perfil) {
      return res.status(404).json({ mensagem: "Nenhuma imagem para remover." });
    }
    const caminho = usuarios[0].imagem_perfil;
    // Remove o caminho do banco
    await db.execute("UPDATE usuarios SET imagem_perfil = NULL WHERE id_usuario = ?", [id]);
    // Remove o arquivo do disco
    import('fs').then(fs => {
      fs.unlink(caminho, err => {});
    });
    res.status(200).json({ mensagem: "Imagem removida com sucesso!" });
  } catch (erro) {
    console.error("Erro ao remover imagem:", erro);
    res.status(500).json({ mensagem: "Erro ao remover imagem de perfil." });
  }
}

export async function criarPostagem(req, res) {
  const { id } = req.params;
  if (!req.file) {
    return res.status(400).json({ mensagem: "Nenhuma imagem enviada." });
  }
  try {
    const db = await conexao.bancoDados();
    // Busca o nome do usuário
    const [usuarios] = await db.execute("SELECT nome FROM usuarios WHERE id_usuario = ?", [id]);
    if (!usuarios.length) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }
    const caminho = req.file.path.replace(/\\/g, "/");
    await db.execute(
      'INSERT INTO postagens (id_usuario, imagem, nome_usuario) VALUES (?, ?, ?)',
      [id, caminho, usuarios[0].nome]
    );
    res.status(201).json({ mensagem: "Postagem enviada com sucesso!", imagem: caminho });
  } catch (erro) {
    console.error("Erro ao criar postagem:", erro);
    res.status(500).json({ mensagem: "Erro ao salvar postagem." });
  }
}

export async function listarPostagens(req, res) {
  try {
    const db = await conexao.bancoDados();
    const [postagens] = await db.execute(
      'SELECT p.imagem, u.nome AS nome_usuario FROM postagens p JOIN usuarios u ON p.id_usuario = u.id_usuario ORDER BY p.id_postagem DESC'
    );
    res.status(200).json(postagens);
  } catch (erro) {
    console.error("Erro ao listar postagens:", erro);
    res.status(500).json({ mensagem: "Erro ao buscar postagens." });
  }
}
