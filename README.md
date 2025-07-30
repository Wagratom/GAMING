# 🎮 GAMING Server – BACKEND

Este repositório abriga o desenvolvimento de um **servidor para um jogo multiplayer**, idealizado como um projeto para estudo prático de **arquitetura de software**, **design patterns**, **DDD**, e outras disciplinas importantes do desenvolvimento backend moderno.

Nosso objetivo com esse projeto é aprender e aplicar conceitos fundamentais, enquanto construímos algo divertido e desafiador: **um servidor funcional para um game multiplayer.**

---

## 🚀 Objetivos de Desenvolvimento

Durante este projeto, pretendo explorar e consolidar conhecimentos nas seguintes áreas:

- 📋 **Planejamento e orquestração de projeto**
- 🧩 **Divisão de responsabilidades e organização modular**
- 🤝 **Boas práticas com Git e controle de versões**
- ✨ **Clean Code, Clean Architecture, Design Patterns, DDD**
- 🌐 **Protocolos HTTP e WebSocket**
- 📡 **Arquitetura orientada a eventos**
- 🧠 **Modelagem e persistência de dados**
- 🐳 **Docker, docker-compose, CI/CD**
- 📊 **Monitoramento e rastreamento de eventos**

---

## 🔖 Metodologia

O projeto será desenvolvido em ciclos iterativos por meio de MVPs (Minimum Viable Products).  
Cada entrega representará uma **feature funcional e testada**, mantendo o escopo sob controle e favorecendo a evolução contínua.

---

## 📦 Estrutura Base + Módulo de Usuários

### ✅ Serviços

Abaixo, os serviços previstos para o servidor do jogo. A lista será marcada conforme o desenvolvimento avança.

---

### 👤 Usuários

- [ ] **Gerenciamento de Usuários**
  - [ ] Criar usuário (registro/login)
  - [ ] Atualizar perfil (auth + proprietário)
  - [ ] Deletar conta (auth + proprietário)
  - [ ] Obter perfil do próprio usuário (auth)
  - [ ] Obter perfil por ID (auth)
  - [ ] Listar todos os usuários (auth)
  - [ ] Listar usuários online (auth)
  - [ ] Listar amigos (auth)

- [ ] **Ações de Usuário**
  - [ ] Adicionar amigo
  - [ ] Recusar pedido de amizade
  - [ ] Excluir amigo
  - [ ] Bloquear usuário
  - [ ] Denunciar usuário
  - [ ] Convidar para grupo
  - [ ] Convidar para partida
  - [ ] Enviar mensagem

#### 📜 Regras de Negócio – Módulo de Usuário

- Um usuário pode **bloquear outro usuário**.
- Usuários bloqueados **não podem visualizar o perfil** de quem os bloqueou.
- Usuários **não podem ser amigos de usuários bloqueados** (amizade é removida).
- Usuários **não podem denunciar outros usuários sem uma justificativa em texto**.
- Um usuário **nunca é deletado de verdade** (soft delete com histórico).
- O **nickname deve ser único** no sistema.
- O **perfil do usuário é público por padrão**, exceto para bloqueados.

---

### 💬 Chat

- [ ] **Gerenciamento de Chats**
  - [ ] Criar chat privado (auth)
  - [ ] Criar chat público (auth)
  - [ ] Criar chat protegido (auth)
  - [ ] Atualizar chat (auth - proprietário / ADM)
  - [ ] Deletar chat (auth - proprietário)
  - [ ] Obter dados do chat (auth)
  - [ ] Adicionar administrador (auth - proprietário / ADM)
  - [ ] Bloquear usuário no chat (auth - proprietário / ADM)
  - [ ] Banir usuário do chat (auth - proprietário / ADM)
  - [ ] Obter mensagens do chat (auth - participantes)
  - [ ] Convidar para chat (auth - público / protegido)

#### 📜 Regras de Negócio – Módulo de Chat

##### 🔒 Chat Privado

> Chat individual entre dois amigos. Criado automaticamente.

- Apenas entre **amigos**.
- Sem **administrador** ou **proprietário**.
- Criado com **dados padrão**.
- **Apenas os participantes** podem interagir.

##### 🌐 Chat Público

> Acesso aberto a todos os usuários autenticados.

- Participação livre.
- Possui **proprietário** e **administradores**.
- Apenas ADM/proprietário podem:
  - Atualizar o chat
  - Bloquear, banir, remover usuários
- **Somente o proprietário** pode deletar o chat.

##### 🛡️ Chat Protegido

> Acesso somente por convite.

- Participação apenas por **convite**.
- Possui **proprietário** e **administradores**.
- Apenas ADM/proprietário podem:
  - Atualizar o chat
  - Gerenciar usuários (bloquear, banir, convidar)
- **Somente o proprietário** pode deletar.

##### 👥 Chat de Grupo

> Criado automaticamente para times/salas temporárias.

- Sem **admin** ou **proprietário**.
- Nome/descrição padrão.
- Apagado ao fim da atividade (partida, grupo, etc).

---

### 📢 Notificações e Eventos

- [ ] Notificar ao receber pedido de amizade
- [ ] Notificar ao receber convite de equipe
- [ ] Notificar ao ser convidado para um chat
- [ ] Notificar ao receber punições
- [ ] Notificar ao encontrar uma partida

---

### 📊 Histórico e Estatísticas

> Em planejamento para futuras versões.

---

### 🎯 Lobby & Partidas

> Definirá lógica de matchmaking, equipes e sistema de partidas.

---

### 📡 Comunicação em Tempo Real

> Utilização de **WebSocket** e **eventos** para ações em tempo real (chat, lobby, jogo, etc).

- [ ] **Mensagens** em tempo real
- [ ] **Convites** (amizade, grupo, partida)
- [ ] **Eventos de partida** (início, fim, resultados)
- [ ] **Status online/offline** dos usuários
- [ ] **Status de jogo** (no lobby, jogando, em partida)

---

## 🛠️ Tecnologias Pretendidas

- **Linguagem:** Java (17+)
- **Framework:** Spring Boot
- **Banco de Dados:** PostgreSQL
- **Mensageria:** Kafka ou Redis Pub/Sub
- **Autenticação:** JWT
- **WebSocket:** Spring WebSocket
- **Testes:** JUnit + Mockito
- **Monitoramento:** TBD (Ex: Prometheus, Grafana, etc.)
- **Containerização:** Docker + docker-compose

---

### ✅ Serviços

---
## 📚 Licença

Projeto livre para fins educacionais, pessoais e estudo.  
Sinta-se à vontade para abrir **issues**, sugerir melhorias ou **enviar pull requests**!  
Este repositório não possui licença formal no momento.

---

> _“Aprender fazendo: é assim que se constrói software... e conhecimento.”_
