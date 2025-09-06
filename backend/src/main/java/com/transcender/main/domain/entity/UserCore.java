package com.transcender.main.domain.entity;

import com.transcender.main.domain.exceptions.UsuarioArgumentInvalid;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public class UserCore {
    private Long id;
    private String email;
    private String senhaHash;
    private String nickname;
    private String telefone;
    private String avatar;
    private boolean online;
    private boolean ative;
    private Instant criadoEm;
    private Instant atualizadoEm;

    private Set<FriendCore> solicitadas;
    private Set<FriendCore> recebidas;


    private List<MatchCore> partidasComoUsuario1;
    private List<MatchCore> partidasComoUsuario2;
    private List<MatchCore> partidasVencidas;


    public UserCore() {
    }

    public UserCore(Long id, String email, String senha, String nickname, String telefone,
                    boolean online, boolean ative, Set<FriendCore> solicitadas, Set<FriendCore> recebidas,
                    List<MatchCore> partidasComoUsuario1, List<MatchCore> partidasComoUsuario2,
                    List<MatchCore> partidasVencidas, Instant criadoEm, Instant atualizadoEm) {

        if (id == null || id <= 0) throw new UsuarioArgumentInvalid("Id invalido");
        this.id = id;
        this.email = email;
        this.senhaHash = senha;
        this.nickname = nickname;
        this.telefone = telefone;
        this.avatar = String.format("https://carddesigner.s3.us-east-2.amazonaws.com/public/avatars/%s.png", id);

        this.online = online;
        this.ative = ative;

        this.criadoEm = criadoEm;
        this.atualizadoEm = atualizadoEm;

        this.solicitadas = solicitadas;
        this.recebidas = recebidas;

        this.partidasComoUsuario1 = partidasComoUsuario1;
        this.partidasComoUsuario2 = partidasComoUsuario2;
        this.partidasVencidas = partidasVencidas;
    }

    public UserCore(String email, String senha, String nickname, String telefone, Optional<Long> id) {
        id.ifPresent(value -> this.id = value);
        this.email = email;
        this.senhaHash = senha;
        this.nickname = nickname;
        this.telefone = telefone;
        this.avatar = "https://carddesigner.s3.us-east-2.amazonaws.com/public/avatars/" + id;
        this.online = false;
        this.ative = true;
        this.criadoEm = Instant.now();
        this.atualizadoEm = Instant.now();
    }

    public void validateUpdateUser(Long solicitanteId) {
        this.validateCreateUser();
        if (solicitanteId == null || solicitanteId <= 0)
            throw new UsuarioArgumentInvalid("Id inválido: deve ser positivo");
        this.criadoEm = null;
    }

    public void validateCreateUser() {
        boolean emailVazio = email == null || email.trim().isEmpty();
        boolean nicknameVazio = nickname == null || nickname.trim().isEmpty();

        if (emailVazio && nicknameVazio) {
            throw new UsuarioArgumentInvalid("Email ou nickname devem ser especificados");
        }

        if (nickname != null && nickname.length() > 15) {
            throw new UsuarioArgumentInvalid(String.format("Nickname: inválido '%s' maior que 15 caracteres", nickname));
        }

        if (email != null && email.length() > 50) {
            throw new UsuarioArgumentInvalid("Email inválido: deve ter no máximo 100 caracteres");
        }

        if (senhaHash == null || senhaHash.trim().isEmpty()) {
            throw new UsuarioArgumentInvalid("Senha inválida");
        }
    }

    @Override
    public String toString() {
        return "UserCore{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", nickname='" + nickname + '\'' +
                ", telefone='" + telefone + '\'' +
                ", online=" + online +
                ", ative=" + ative +
                ", criadoEm=" + criadoEm +
                ", atualizadoEm=" + atualizadoEm +
                ", solicitadasCount=" + (solicitadas != null ? solicitadas.size() : 0) +
                ", recebidasCount=" + (recebidas != null ? recebidas.size() : 0) +
                '}';
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getSenhaHash() {
        return senhaHash;
    }

    public String getNickname() {
        return nickname;
    }

    public String getTelefone() {
        return telefone;
    }

    public String getAvatar() {
        return avatar;
    }

    public boolean getOnline() {
        return online;
    }

    public boolean getAtive() {
        return ative;
    }

    public List<MatchCore> getWinnersMatches() {
        return partidasVencidas;
    }

    public List<MatchCore> getLosesMatches() {
        List<MatchCore> losses = new ArrayList<>(getTodasPartidas());
        if (partidasVencidas != null) {
            losses.removeAll(partidasVencidas);
        }
        return losses;
    }

    public List<MatchCore> getTodasPartidas() {
        List<MatchCore> todas = new ArrayList<>();
        if (partidasComoUsuario1 != null) {
            todas.addAll(partidasComoUsuario1);
        }
        if (partidasComoUsuario2 != null) {
            todas.addAll(partidasComoUsuario2);
        }
        return todas;
    }

    public Instant getCriadoEm() {
        return criadoEm;
    }

    public Instant getAtualizadoEm() {
        return atualizadoEm;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setSenhaHash(String getSenhaHash) {
        this.senhaHash = getSenhaHash;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public void setOnline(boolean online) {
        this.online = online;
    }

    public void setAtive(boolean ative) {
        this.ative = ative;
    }

    public void setCriadoEm(Instant criadoEm) {
        this.criadoEm = criadoEm;
    }

    public void setAtualizadoEm(Instant atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }
}
