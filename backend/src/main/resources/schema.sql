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
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de chats (ChatCoreJpa)
CREATE TABLE IF NOT EXISTS chat (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    chatname VARCHAR(20) NULL COMMENT 'Nome do chat',
    onwer BIGINT NULL COMMENT 'ID do dono do chat',
    type VARCHAR(10) NOT NULL COMMENT 'PUBLIC, PRIVATE, PROTECT',
    descricao TEXT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (onwer) REFERENCES usuarios(id)
);

-- Tabela intermediária: usuários no chat (ChatUserCoreJpa)
CREATE TABLE IF NOT EXISTS chat_usuarios (
    chat_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    status_chat VARCHAR(10) NOT NULL COMMENT 'ativo, bloqueado, banido, removido',
    permition_chat VARCHAR(10) NOT NULL COMMENT 'admin, member, viewer, etc',
    entrou_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE (usuario1_id, usuario2_id),
  FOREIGN KEY (usuario1_id) REFERENCES usuarios(id),
  FOREIGN KEY (usuario2_id) REFERENCES usuarios(id)
);

-- Tabela de partidas
CREATE TABLE IF NOT EXISTS partidas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_1 BIGINT NOT NULL,
    usuario_2 BIGINT NOT NULL,
    score_usuario_1 INT NULL,
    score_usuario_2 INT NULL,
    mapa VARCHAR(255) NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_1) REFERENCES usuarios(id),
    FOREIGN KEY (usuario_2) REFERENCES usuarios(id)
);


-- Inserts de usuários (4 apenas)
--INSERT INTO usuarios (email, senha_hash, nickname, telefone, avatar, online, ative) VALUES
--('user1@email.com', 'hash_senha1', 'UserOne',   '111111111', 'avatar1.png', FALSE, TRUE),
--('user2@email.com', 'hash_senha2', 'UserTwo',   '222222222', 'avatar2.png', TRUE,  TRUE),  -- online
--('user3@email.com', 'hash_senha3', 'UserThree', '333333333', 'avatar3.png', FALSE, TRUE),  -- offline
--('user4@email.com', 'hash_senha4', 'UserFour',  '444444444', 'avatar4.png', FALSE, TRUE);  -- offline
--
---- Amizades conforme regras
---- user1 amigo de user2
--INSERT INTO amigos (usuario1_id, usuario2_id, status) VALUES (1, 2, 'ACCEPTED');
--
---- user1 amigo de user3
--INSERT INTO amigos (usuario1_id, usuario2_id, status) VALUES (1, 3, 'ACCEPTED');
--
---- user1 enviou pedido para user4 (pendente)
--INSERT INTO amigos (usuario1_id, usuario2_id, status) VALUES (1, 4, 'PENDING');
