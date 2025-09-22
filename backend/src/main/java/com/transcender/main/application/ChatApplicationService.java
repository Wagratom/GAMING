package com.transcender.main.application;

import com.transcender.main.domain.entity.ChatCore;
import com.transcender.main.domain.entity.MessageCore;
import com.transcender.main.domain.entity.UserCore;
import com.transcender.main.domain.enuns.ChatType;
import com.transcender.main.domain.exceptions.*;
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
        try {
            if (jwt == null) throw new BadRequest("Token não enviado");
            Map<String, Object> userInfo = jwtService.validateTokenAndGetClaims(jwt.substring(7));
            return ((Number) userInfo.get("id")).longValue();
        } catch (ExpiredJwtException err) {
            throw new Unauthorized("Token expirado amigo!");
        } catch (JwtException ex) {
            throw new Forbidden("Token inválido amigo!");
        }
    }
    private MessageDto toMessageDto(MessageCore message) {
        UserCore sender = message.getSender();
        return new MessageDto(
                message.getId(),
                message.getConteudo(),
                message.getAtualizadoEm().toString(),
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
        getIdByToken(jwt);
        Optional<ChatCore> chat = chatRepository.getChatByName(chatName);
        if (chat.isEmpty()) throw new BadRequest("Chat não existe");

        logger.info("chat.get().getType().equals(ChatType.PROTECT): {}", chat.get().getType().equals(ChatType.PROTECT));
        logger.info("password: {}", password);
        logger.info("chat.get().getPassword(): {}", chat.get().getPassword());
        logger.info("chat.get().getPassword(): {}", encriptyService.checkPassword(password, chat.get().getPassword()));
        if (chat.get().getType().equals(ChatType.PROTECT) && !encriptyService.checkPassword(password, chat.get().getPassword())) {
            throw new Forbidden("Password invalido");
        }
        return chat.get();
    }

    @Override
    public ChatCore getGroupChatById(String jwt, Long chatId) {
        getIdByToken(jwt);
        return chatRepository.findChatById(chatId).orElseThrow(() -> new BadRequest("Chat não existe"));
    }
    @Override
    public boolean deleteChat(Long chatId, Long userId) {
        if (chatId == null || chatId <= 0)
            throw new BadRequest("Id do chat inválido");

        if (userId == null || userId <= 0)
            throw new BadRequest("Id do usuário inválido");

        ChatCore chat = chatRepository.findChatById(chatId)
                .orElseThrow(() -> new ResourceNotFound("Chat", chatId));

        if (!chat.getChatOwner().equals(userId))
            throw new Forbidden("Você não tem permissão para deletar este chat");

        return chatRepository.deleteChat(chatId);
    }

//    @Override
//    public ChatCore updateChat(ChatCore chatUpdate, Long solicitanteId) {
//        ChatCore oldChat = chatRepository.findChatById(chatUpdate.getId())
//                .orElseThrow(() -> new ResourceNotFound("Chat", chatUpdate.getId()));
//
//        oldChat.validateUpdateChat(solicitanteId);
//
//        // Atualizações encapsuladas
//        oldChat.updateChatName(chatUpdate.getChatName());
//        oldChat.updateDescricao(chatUpdate.getDescricao());
//        oldChat.updateType(chatUpdate.getType());
//
//        chatRepository.updateChat(oldChat);
//        return oldChat;
//    }

    @Override
    public List<ChatCore> getPublicsChats(String jwt) {
        getIdByToken(jwt);
        return chatRepository.getPublicChats();
    }

    @Override
    public boolean addUsuarioChat(Long chatId, UserCore usuario) {
        // TODO: Implementar regra de negócio
        return false;
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
