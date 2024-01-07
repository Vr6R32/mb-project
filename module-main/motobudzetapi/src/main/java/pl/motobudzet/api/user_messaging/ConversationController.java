package pl.motobudzet.api.user_messaging;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "api/conversations")
public class ConversationController {

    private final ConversationService conversationService;

    @PostMapping("create")
    public Long createConversation(@RequestParam UUID advertisementId, Authentication authentication) {
        return conversationService.createConversation(advertisementId, authentication.getName());
    }

    @GetMapping("id")
    public Long getConversationIdByAdvertisementIdAndSender(@RequestParam UUID advertisementId, Principal principal) {
        return conversationService.findConversationIdByAdvIdAndSender(advertisementId, principal.getName());
    }

    @GetMapping
    public List<ConversationDTO> getAllConversations(Principal userName) {
        return conversationService.getAllConversations(userName.getName());
    }
}

