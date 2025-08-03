package com.transcender.main.adapters.in.controller;

import com.transcender.main.application.dto.ChatApplicationDto;
import com.transcender.main.application.service.ChatApplicationService;
import com.transcender.main.domain.Entity.ChatCore;
import com.transcender.main.domain.port.in.ChatPort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/chats")
public class ChatController {
    private final ChatPort chatService;


    public ChatController(ChatApplicationService chatService){
        this.chatService = chatService;
    }

//    @GetMapping
//    public List<ChatApplicationDto> getAllChats(){
//        return chatService.getAllChats()
//                .stream()
//                .map(this::toDto)
//                .collect(Collectors.toList());
//    }
//
//    private ChatApplicationDto toDto(ChatCore core) {
//        ChatApplicationDto dto = new ChatApplicationDto();
//        dto.setId(core.getId());
//        dto.setChatName(core.getChatName());
//        dto.setDescricao(core.getDescricao());
//        dto.setType(core.getType());
//        dto.setChatOwner(core.getChatOwner());
//        return dto;
//    }






}
