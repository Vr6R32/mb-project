package pl.motobudzet.api.user_messaging;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "api/conversations")
public class ConversationController {

    private final ConversationService conversationService;

    @GetMapping("id")
    public Long getConversationIdByAdvertisementIdAndSender(@RequestParam UUID advertisementId, Authentication authentication) {
        return conversationService.findConversationIdByAdvIdAndSender(advertisementId, authentication.getName());
    }

    @GetMapping
    public List<ConversationDTO> getAllConversations(Authentication authentication) {
        return conversationService.getAllConversations(authentication.getName());
    }
}

