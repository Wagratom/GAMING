package com.transcender.main.adapters.in.controller.dto.responses;

import com.transcender.main.domain.entity.MessageCore;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

public class DirectChatResponse {
    private record SenderDto(Long id, String nickname, String avatar, boolean online) {
    }

    public record MessageDto(Long id, String content, Instant date, SenderDto sender) {
    }

    private final List<MessageDto> messages;

    public DirectChatResponse(List<MessageCore> messages) {
        this.messages = messages.stream()
                .map((message) -> (
                        new MessageDto(
                                message.getId(),
                                message.getConteudo(),
                                message.getAtualizadoEm() != null ? message.getAtualizadoEm() : message.getCriadoEm(),
                                new SenderDto(
                                        message.getSender().getId(),
                                        message.getSender().getNickname(),
                                        message.getSender().getAvatar(),
                                        message.getSender().getOnline()
                                )
                        )
                )).collect(Collectors.toList());
    }

    public List<MessageDto> getMessages() {
        return messages;
    }
}
