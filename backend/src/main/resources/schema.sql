-- Tabela de usuários (UserCoreJpa)
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE COMMENT 'E-mail do usuário (único se não for nulo)',
    senha_hash VARCHAR(512) NOT NULL COMMENT 'Hash da senha',
    nickname VARCHAR(255) UNIQUE COMMENT 'Apelido único (único se não for nulo)',
    telefone VARCHAR(20) NULL,
    avatar VARCHAR(50) NULL,
    online BOOLEAN NOT NULL DEFAULT FALSE,
    ative BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de chats (ChatCoreJpa)
CREATE TABLE IF NOT EXISTS chat (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    chatname VARCHAR(20),
    owner BIGINT,
    type VARCHAR(10) NOT NULL,
    descricao TEXT,
    password TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    chatname_unique VARCHAR(20) GENERATED ALWAYS AS (
        CASE WHEN type IN ('PUBLIC','PROTECT') THEN LOWER(chatname) ELSE NULL END
    ),
    FOREIGN KEY (owner) REFERENCES usuarios(id),
    UNIQUE (chatname_unique)
);

-- Tabela intermediária: usuários no chat (ChatUserCoreJpa)
CREATE TABLE IF NOT EXISTS chat_usuarios (
    chat_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    status_chat VARCHAR(10) NOT NULL COMMENT 'ativo, bloqueado, banido, removido',
    permition_chat VARCHAR(10) NOT NULL COMMENT 'admin, member, viewer, etc',
    entrou_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    saiu_em TIMESTAMP NULL,
    PRIMARY KEY (chat_id, usuario_id),
    FOREIGN KEY (chat_id) REFERENCES chat(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabela de mensagens (MessageCoreJpa)
CREATE TABLE IF NOT EXISTS mensagens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    chat_id BIGINT NOT NULL COMMENT 'ID do chat',
    sender_id BIGINT NOT NULL COMMENT 'Usuário que enviou',
    conteudo TEXT NULL COMMENT 'Texto da mensagem',
    tipo VARCHAR(20) NOT NULL COMMENT 'TEXT, IMAGE, VIDEO, SYSTEM...',
    nickname VARCHAR(255) NULL COMMENT 'Apelido no momento do envio',
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    editado BOOLEAN NOT NULL DEFAULT FALSE,
    deletado BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (chat_id) REFERENCES chat(id),
    FOREIGN KEY (sender_id) REFERENCES usuarios(id)
);

-- Tabela de amigos
CREATE TABLE IF NOT EXISTS amigos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  usuario1_id BIGINT NOT NULL,
  usuario2_id BIGINT NOT NULL,
  status VARCHAR(50) NOT NULL COMMENT 'PENDING, ACCEPTED, DECLINED, BLOCKED, REMOVED',
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE (usuario1_id, usuario2_id),
  FOREIGN KEY (usuario1_id) REFERENCES usuarios(id),
  FOREIGN KEY (usuario2_id) REFERENCES usuarios(id)
);

-- Tabela de partidas (MatchCoreJpa) simplificada, sem empate
CREATE TABLE IF NOT EXISTS partidas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mapa VARCHAR(100) NOT NULL COMMENT 'Nome do mapa da partida',
    winner_id BIGINT NOT NULL COMMENT 'Usuário vencedor',
    loser_id BIGINT NOT NULL COMMENT 'Usuário perdedor',
    winner_score INT NOT NULL COMMENT 'Pontuação do vencedor',
    loser_score INT NOT NULL COMMENT 'Pontuação do perdedor',
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (winner_id) REFERENCES usuarios(id),
    FOREIGN KEY (loser_id) REFERENCES usuarios(id)
);

-- Inserts de usuários (4 apenas)
--INSERT INTO usuarios (email, senha_hash, nickname, telefone, avatar, online, ative) VALUES
--('user1@email.com', 'hash_senha1', 'UserOne',   '111111111', 'avatar1.png', FALSE, TRUE),
--('user2@email.com', 'hash_senha2', 'UserTwo',   '222222222', 'avatar2.png', TRUE,  TRUE),  -- online
--('user3@email.com', 'hash_senha3', 'UserThree', '333333333', 'avatar3.png', FALSE, TRUE),  -- offline
--('user4@email.com', 'hash_senha4', 'UserFour',  '444444444', 'avatar4.png', FALSE, TRUE);  -- offline
--
---- Amizades conforme regras
--INSERT INTO amigos (usuario1_id, usuario2_id, status) VALUES (1, 2, 'ACCEPTED');
--INSERT INTO amigos (usuario1_id, usuario2_id, status) VALUES (1, 3, 'ACCEPTED');
--INSERT INTO amigos (usuario1_id, usuario2_id, status) VALUES (1, 4, 'PENDING');
--
---- Partidas exemplo
---- User1 ganhou de User2
--INSERT INTO partidas (winner_id, loser_id, winner_score, loser_score, mapa)
--VALUES (1, 2, 10, 7, 'arena_default');
--
---- User3 ganhou de User1
--INSERT INTO partidas (winner_id, loser_id, winner_score, loser_score, mapa)
--VALUES (1, 3, 10, 7, 'arena_space');
--
--INSERT INTO partidas (winner_id, loser_id, winner_score, loser_score, mapa)
--VALUES (3, 1, 10, 5, 'arena_neon');
