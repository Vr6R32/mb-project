package pl.motobudzet.api.user_conversations.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pl.motobudzet.api.user_conversations.dto.ConversationDTO;
import pl.motobudzet.api.user_conversations.service.ConversationService;

import java.security.Principal;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "api/conversations")
public class ConversationController {

    private final ConversationService conversationService;

    @PostMapping("create")
    public Long createConversation(@RequestParam String advertisementId, Authentication authentication) {
        return conversationService.createConversation(advertisementId, authentication.getName());
    }

    @GetMapping("id")
    public Long getConversationIdByAdvertisementIdAndSender(@RequestParam String advertisementId,Principal principal){
        return conversationService.findConversationIdByAdvIdAndSender(advertisementId, principal.getName());
    }

    @GetMapping
    public List<ConversationDTO> getAllConversations(Principal userName) {
        return conversationService.getAllConversations(userName.getName());
    }
}

