export function homeInfo(req, res) {
  res.status(200).json({ mensagem: "Bem-vindo à CreatiVault! Use o menu para navegar." });
}
