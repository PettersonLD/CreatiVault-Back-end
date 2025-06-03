DROP DATABASE IF EXISTS creativault;
CREATE DATABASE IF NOT EXISTS creativault;
USE creativault;

CREATE TABLE usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  email VARCHAR(100),
  telefone VARCHAR(20),
  imagem_perfil VARCHAR(255)
);

CREATE TABLE postagens (
  id_postagem INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT,
  imagem VARCHAR(255),
  nome_usuario VARCHAR(100),
  data_postagem TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);
