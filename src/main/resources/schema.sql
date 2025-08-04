-- Tabela de usuários (UserCoreJpa)
CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único do usuário',
    email VARCHAR(255) UNIQUE COMMENT 'E-mail do usuário (único se não for nulo)',
    senha_hash VARCHAR(512) NOT NULL COMMENT 'Hash da senha',
    nickname VARCHAR(255) UNIQUE COMMENT 'Apelido único (único se não for nulo)',
    telefone VARCHAR(20),
    online BOOLEAN,
    ative BOOLEAN,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);




-- Tabela de chats (ChatCoreJpa)
CREATE TABLE Chat (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    chatname VARCHAR(20) NOT NULL COMMENT 'Nome do chat',
    onwer BIGINT NOT NULL COMMENT 'ID do dono do chat',
    type VARCHAR(10) NOT NULL COMMENT 'PUBLIC, PRIVATE, PROTECT',
    descricao TEXT,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (onwer) REFERENCES Usuarios(id)
);

-- Tabela intermediária: usuários no chat (ChatUserCoreJpa)
CREATE TABLE ChatUsuarios (
    chat_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    status_chat VARCHAR(10) NOT NULL COMMENT 'ativo, bloqueado, banido, removido',
    permition_chat VARCHAR(10) NOT NULL COMMENT 'admin, member, viewer, etc',
    entrou_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    saiu_em TIMESTAMP NULL,
    PRIMARY KEY (chat_id, usuario_id),
    FOREIGN KEY (chat_id) REFERENCES Chat(id),
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id)
);

-- Tabela de amigos
CREATE TABLE Amigos (
    usuario_1 BIGINT NOT NULL,
    usuario_2 BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL COMMENT 'pendente, aceito, bloqueado',
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_1, usuario_2),
    FOREIGN KEY (usuario_1) REFERENCES Usuarios(id),
    FOREIGN KEY (usuario_2) REFERENCES Usuarios(id)
);

-- Tabela de partidas
CREATE TABLE Partidas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_1 BIGINT NOT NULL,
    usuario_2 BIGINT NOT NULL,
    score_usuario_1 INT,
    score_usuario_2 INT,
    mapa VARCHAR(255),
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_1) REFERENCES Usuarios(id),
    FOREIGN KEY (usuario_2) REFERENCES Usuarios(id)
);
