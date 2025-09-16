package com.transcender.main.application;

import com.transcender.main.domain.entity.ChatCore;
import com.transcender.main.domain.entity.MessageCore;
import com.transcender.main.domain.entity.UserCore;
import com.transcender.main.domain.exceptions.BadRequest;
import com.transcender.main.domain.exceptions.Forbidden;
import com.transcender.main.domain.exceptions.ResourceNotFound;
import com.transcender.main.domain.exceptions.Unauthorized;
import com.transcender.main.domain.port.in.ChatPort;
import com.transcender.main.domain.port.out.ChatRepositoryPort;
import com.transcender.main.domain.port.out.FriendsRepositoryPort;
import com.transcender.main.domain.port.out.JwtService;
import com.transcender.main.domain.port.out.UserRepositoryPort;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatApplicationService implements ChatPort {

    private final ChatRepositoryPort chatRepository;
    private final UserRepositoryPort userRepository;
    private final JwtService jwtService;
    private final FriendsRepositoryPort friendRepository;
    private final SimpMessagingTemplate messagingTemplate;
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

    private UsersPair usersExists(Long requester, Long friendId) {
        if (requester.equals(friendId)) throw new BadRequest("O usuario não pode adicionar ele mesmo");

        logger.info("[INIT] pegando mensagens privadas entre o {} e {}", requester, friendId);
        UserCore user1 = userRepository.getUserById(requester)
                .orElseThrow(() -> new ResourceNotFound("Usuario", friendId));

        UserCore user2 = userRepository.getUserById(friendId)
                .orElseThrow(() -> new ResourceNotFound("friendId", friendId));

        return new UsersPair(user1, user2);
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
        UsersPair users = usersExists(userId, friendId);

        logger.info("[INFO] verificando se existe amizade entre os 2 usuarios");
        if (!friendRepository.existsFriends(users.requester.getId(), users.friend.getId())) {
            throw new Forbidden("Os usuarios não são amigos");
        }

        logger.info("[END] Processo finalizado com sucesso");
        return chatRepository.getOrCreateDirectChat(users.requester, users.friend);
    }

    @Override
    public void postDirectChat(String jwt, Long friendId, String content) {
        Long userId = getIdByToken(jwt);
        UsersPair users = usersExists(userId, friendId);

        logger.info("[INFO] adicionando nova mensagem no chat privado");
        if (!friendRepository.existsFriends(users.requester.getId(), users.friend.getId()))
            throw new Forbidden("Os usuarios não são amigos");

        MessageCore messageCore = chatRepository.addNewMessageDirectChat(users.requester(), users.friend(), content);

        logger.info("[END] enviando resposta");
        messagingTemplate.convertAndSend("/topic/directChats/" + userId, toMessageDto(messageCore));
        messagingTemplate.convertAndSend("/topic/directChats/" + friendId, toMessageDto(messageCore));
    }

    @Override
    public ChatCore createChat(ChatCore chat) {
        chat.validateCreateChat();

        userRepository.getUserById(chat.getChatOwner())
                .orElseThrow(() -> new ResourceNotFound("Usuário", chat.getChatOwner()));

        return chatRepository.createChat(chat);
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

    @Override
    public ChatCore updateChat(ChatCore chatUpdate, Long solicitanteId) {
        ChatCore oldChat = chatRepository.findChatById(chatUpdate.getId())
                .orElseThrow(() -> new ResourceNotFound("Chat", chatUpdate.getId()));

        oldChat.validateUpdateChat(solicitanteId);

        // Atualizações encapsuladas
        oldChat.updateChatName(chatUpdate.getChatName());
        oldChat.updateDescricao(chatUpdate.getDescricao());
        oldChat.updateType(chatUpdate.getType());

        chatRepository.updateChat(oldChat);
        return oldChat;
    }

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
