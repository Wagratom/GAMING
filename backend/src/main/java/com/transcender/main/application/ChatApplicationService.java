package com.transcender.main.application;

import com.transcender.main.domain.entity.ChatCore;
import com.transcender.main.domain.entity.ChatUserCore;
import com.transcender.main.domain.entity.MessageCore;
import com.transcender.main.domain.entity.UserCore;
import com.transcender.main.domain.enuns.ChatType;
import com.transcender.main.domain.enuns.MessageType;
import com.transcender.main.domain.enuns.PermitionChat;
import com.transcender.main.domain.enuns.StatusChat;
import com.transcender.main.domain.exceptions.*;
import com.transcender.main.domain.exceptions.InternalError;
import com.transcender.main.domain.port.in.ChatPort;
import com.transcender.main.domain.port.out.*;
import com.transcender.main.domain.valueobject.CreateChatDto;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ChatApplicationService implements ChatPort {

    private final ChatRepositoryPort chatRepository;
    private final UserRepositoryPort userRepository;
    private final JwtService jwtService;
    private final FriendsRepositoryPort friendRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final EncriptyService encriptyService;
    private final Logger logger = LoggerFactory.getLogger(ChatApplicationService.class);

    //records utilizados para gerar os objetos de resposta
    private record UsersPair(UserCore requester, UserCore friend) {
    }

    private record SenderDto(Long id, String nickname, String avatar, Boolean online) {
    }

    public record MessageDto(Long id, String content, String date, SenderDto sender) {
    }

    private Long getIdByToken(String jwt) {
        if (jwt == null) throw new BadRequest("Token não enviado");
        try {
            Map<String, Object> userInfo = jwtService.validateTokenAndGetClaims(jwt.substring(7));
            return ((Number) userInfo.get("id")).longValue();
        } catch (ExpiredJwtException err) {
            throw new Unauthorized("Token expirado amigo!");
        } catch (JwtException ex) {
            throw new Unauthorized("Token inválido amigo!");
        }
    }

    private MessageDto toMessageDto(MessageCore message) {
        UserCore sender = message.getSender();
        return new MessageDto(
                message.getId(),
                message.getConteudo(),
                message.getAtualizadoEm() != null ? message.getAtualizadoEm().toString() : message.getCriadoEm().toString(),
                new SenderDto(
                        sender.getId(),
                        sender.getNickname(),
                        sender.getAvatar(),
                        sender.getOnline()
                )
        );
    }

    @Override
    public ChatCore getDirectChat(String jwt, Long friendId) {
        Long userId = getIdByToken(jwt);
        logger.info("[INIT] pegando as mensagens privadas entre user {} e user {}", userId, friendId);

        UserCore friend = userRepository.getUserById(friendId)
                .orElseThrow(() -> new ResourceNotFound("Usuario não existe", friendId));

        if (!friendRepository.existsFriends(userId, friendId)) {
            throw new Forbidden("Os usuarios não são amigos");
        }

        logger.info("[END] Processo finalizado com sucesso");
        return chatRepository.getOrCreateDirectChat(userId, friend).chat();
    }

    @Override
    public void addMessageDirectChat(String jwt, Long friendId, String content) {
        Long userId = getIdByToken(jwt);

        logger.info("[INFO] adicionando nova mensagem no chat privado");
        if (!friendRepository.existsFriends(userId, friendId)) throw new Forbidden("Os usuarios não são amigos");

        UserCore friend = userRepository.getUserById(friendId)
                .orElseThrow(() -> new ResourceNotFound("Usuario não existe", friendId));

        ChatRepositoryPort.responsePrivateChat addMessageDto = chatRepository.getOrCreateDirectChat(userId, friend);
        MessageCore messageCore = chatRepository.addNewMessageDirectChat(addMessageDto, content);

        logger.info("[END] enviando resposta");
        messagingTemplate.convertAndSend("/topic/directChats/" + userId, toMessageDto(messageCore));
        messagingTemplate.convertAndSend("/topic/directChats/" + friendId, toMessageDto(messageCore));
    }

    public boolean isAtiveMember(ChatCore chat, Long userId) {
        if (chat == null) throw new InternalError();

        logger.info("[validation] checking if user is ative member");

        Set<ChatUserCore> members = chat.getMembers();
        if (members == null || members.isEmpty())
            return false;

        Optional<ChatUserCore> member = members.stream().
                filter(memb -> memb.usuarioId().equals(userId))
                .findFirst();

        return member.isPresent() && member.get().statusChat().equals(StatusChat.ATIVE);
    }

    @Override
    public void addMessageGroups(String jwt, Long chatId, String content) {
        Long userId = getIdByToken(jwt);

        logger.info("[INIT] adding new message group, getting chat {}", chatId);
        ChatCore chat = chatRepository.getChatById(chatId, false)
                .orElseThrow(() -> new ResourceNotFound("chat", chatId));

        if (!isAtiveMember(chat, userId))
            throw new Forbidden("You don't have permission to send a message in this chat");

        logger.info("[Creating] creating a new message to chat");
        MessageCore msg = new MessageCore(
                chat,
                null,
                content,
                MessageType.TEXT
        );
        logger.info("chamando database");
        MessageCore messageCore = chatRepository.addMessageGroups(msg, userId);

        logger.info("[END] sending response to websocket topic");
        messagingTemplate.convertAndSend("/topic/groups/" + chatId, toMessageDto(messageCore));
    }

    @Override
    public ChatCore createChat(CreateChatDto chat, String jwt) {
        Long ownerId = getIdByToken(jwt);
        chat.setOwner(userRepository.getUserById(ownerId).get());
        chat.validateChat();

        if (chat.getChatType() == ChatType.PROTECT) {
            chat.setPassword(encriptyService.encryptPassword(chat.getPassword()));
        }

        try {
            return chatRepository.createChat(new ChatCore(chat));
        } catch (DataIntegrityViolationException e) {
            throw new Conflict("Nome de chat já existe");
        }
    }

    @Override
    public ChatCore openChat(String jwt, String chatName, String password) {
        Long userId = getIdByToken(jwt);
        ChatCore chat = chatRepository.getChatByName(chatName)
                .orElseThrow(() -> new ResourceNotFound("chat", chatName));

        if (chat.getType().equals(ChatType.PROTECT) && !encriptyService.checkPassword(password, chat.getPassword())) {
            throw new Forbidden("Password invalido");
        }
        return chat;
    }

    @Override
    public ChatCore getGroupChatById(String jwt, Long chatId) {
        if (chatId == null || chatId <= 0)
            throw new BadRequest("chat id invalid");

        Long userId = getIdByToken(jwt);

        logger.info("[INIT] opened chat by id '{}'", chatId);
        ChatCore chat = chatRepository.getChatById(chatId, true)
                .orElseThrow(() -> new ResourceNotFound("chat", chatId));

        if (!isAtiveMember(chat, userId)) {
            logger.info("add member in chat");
            chatRepository.addUserChat(userId, chatId, PermitionChat.MEMBER);
        }

        logger.info("[END] return chat...");
        return chat;
    }

    @Override
    public boolean deleteChat(Long chatId, Long userId) {
        if (chatId == null || chatId <= 0)
            throw new BadRequest("Id do chat inválido");

        if (userId == null || userId <= 0)
            throw new BadRequest("Id do usuário inválido");

        ChatCore chat = chatRepository.getChatById(chatId, false)
                .orElseThrow(() -> new ResourceNotFound("Chat", chatId));

        if (!chat.getChatOwner().equals(userId))
            throw new Forbidden("Você não tem permissão para deletar este chat");

        return chatRepository.deleteChat(chatId);
    }

    @Override
    public List<ChatCore> getPublicsChats(String jwt) {
        getIdByToken(jwt);
        return chatRepository.getPublicChats();
    }

    @Override
    public boolean addUserPublicChat(String jwt, Long chatId) {
        return chatRepository.addUserChat(chatId, getIdByToken(jwt), PermitionChat.MEMBER);
    }

    @Override
    public boolean bloquearUsuarioChat(Long chatId, UserCore usuario) {
        // TODO: Implementar regra de negócio
        return false;
    }

    @Override
    public boolean banirUsuarioChat(Long chatId, UserCore usuario) {
        // TODO: Implementar regra de negócio
        return false;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
