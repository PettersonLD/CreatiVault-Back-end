DROP DATABASE IF EXISTS creativault;
CREATE DATABASE IF NOT EXISTS creativault;
USE creativault;

CREATE TABLE usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  email VARCHAR(100),
  telefone VARCHAR(20)
);
