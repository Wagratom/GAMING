package com.transcender.main.application;

import com.transcender.main.domain.entity.ChatCore;
import com.transcender.main.domain.entity.MessageCore;
import com.transcender.main.domain.entity.UserCore;
import com.transcender.main.domain.exceptions.BadRequest;
import com.transcender.main.domain.exceptions.Forbidden;
import com.transcender.main.domain.exceptions.ResourceNotFound;
import com.transcender.main.domain.port.in.ChatPort;
import com.transcender.main.domain.port.out.ChatRepositoryPort;
import com.transcender.main.domain.port.out.FriendsRepositoryPort;
import com.transcender.main.domain.port.out.JwtService;
import com.transcender.main.domain.port.out.UserRepositoryPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ChatApplicationService implements ChatPort {

    private final ChatRepositoryPort chatRepository;
    private final UserRepositoryPort userRepository;
    private final JwtService jwtService;
    private final FriendsRepositoryPort friendRepository;
    private final Logger logger = LoggerFactory.getLogger(ChatApplicationService.class);

    private record UsersPair(UserCore requester, UserCore friend) {
    }

    ;

    @Autowired
    public ChatApplicationService(ChatRepositoryPort chatRepository,
                                  UserRepositoryPort userRepository,
                                  FriendsRepositoryPort friendRepository,
                                  JwtService jwtService) {
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
        this.friendRepository = friendRepository;
        this.jwtService = jwtService;
    }

    private Long getIdByToken(String jwt) {
        Map<String, Object> userInfo = jwtService.validateTokenAndGetClaims(jwt.substring(7));
        Long userId = ((Number) userInfo.get("id")).longValue();
        return userId;
    }

    private UsersPair usersExists(Long requester, Long friendId) {
        logger.info("[INIT] pegando mensagens privadas entre o {} e {}", requester, friendId);

        UserCore user1 = userRepository.getUserById(requester)
                .orElseThrow(() -> new ResourceNotFound("Usuario", friendId));

        UserCore user2 = userRepository.getUserById(friendId)
                .orElseThrow(() -> new ResourceNotFound("friendId", friendId));


        return new UsersPair(user1, user2);
    }

    private Map<String, Object> messageToJson(MessageCore messages) {
        UserCore sender = messages.getSender();
        return Map.of(
                    "id", messages.getId(),
                    "content", messages.getConteudo(),
                    "date", messages.getAtualizadoEm(),
                    "sender", Map.of(
                        "id", sender.getId(),
                        "nickname", sender.getNickname(),
                        "avatar", sender.getAvatar(),
                        "online", sender.getOnline()
                ));
    }

    @Override
    public Map<String, Object> getDirectChat(String jwt, Long friendId) {
        Long userId = getIdByToken(jwt);
        UsersPair users = usersExists(userId, friendId);

        if (!friendRepository.existsFriends(users.requester.getId(), users.friend.getId())) {
            throw new Forbidden("Os usuarios não são amigos");
        }

        ChatCore chatCore = chatRepository.getOrCreateDirectChat(userId, friendId);

        logger.info("[INFO] Montando json de resposta");
        Map<String, Object> chatJson = Map.of(
                "chatId", chatCore.getId(),
                "chatName", users.friend.getNickname(),
                "messages", chatCore.getMessagens().stream().map(this::messageToJson)
        );
        logger.info("[END] Processo finalizado com sucesso");
        return chatJson;
    }

    @Override
    public Map<String, Object> postDirectChat(String jwt, Long friendId, String content) {
        Long userId = getIdByToken(jwt);
        UsersPair users = usersExists(userId, friendId);

        logger.info("[INFO] Verificando se os usuarios possuem amizade");
        if (!friendRepository.existsFriends(users.requester.getId(), users.friend.getId()))
            throw new Forbidden("Os usuarios não são amigos");

        MessageCore messageCore = chatRepository.addNewMessageDirectChat(users.requester(), users.friend(), content);

        logger.info("[INFO] Montando json de resposta");
        return messageToJson(messageCore);
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
    public List<ChatCore> getAllChats() {
        return chatRepository.getAllChats();
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
