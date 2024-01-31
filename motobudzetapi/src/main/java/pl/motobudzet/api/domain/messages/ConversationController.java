package pl.motobudzet.api.domain.messages;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pl.motobudzet.api.domain.user.entity.AppUser;

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
        AppUser loggedUser = (AppUser) authentication.getPrincipal();
        return conversationService.getAllConversations(loggedUser);
    }
}

