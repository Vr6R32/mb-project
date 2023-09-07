package pl.motobudzet.api.user_conversations.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pl.motobudzet.api.user_conversations.dto.ConversationMessageDTO;
import pl.motobudzet.api.user_conversations.entity.Conversation;
import pl.motobudzet.api.user_conversations.entity.ConversationMessage;
import pl.motobudzet.api.user_conversations.service.ConversationService;
import pl.motobudzet.api.user_conversations.service.MessageService;

import java.security.Principal;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "api/messages")
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public String sendMessage(@RequestParam String message,
                            @RequestParam Long conversationId,
                            Principal principal){
        return messageService.sendMessage(message,conversationId,principal.getName());
    }

    @GetMapping
    public List<ConversationMessageDTO> getAllMessages(@RequestParam Long conversationId,
                                                       Principal principal){
        return messageService.getAllMessages(conversationId,principal.getName());
    }


}

