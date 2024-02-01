package pl.motobudzet.api.adapter.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pl.motobudzet.api.domain.messaging.ConversationDTO;
import pl.motobudzet.api.adapter.facade.MessagingFacade;
import pl.motobudzet.api.domain.user.entity.AppUser;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "api/conversations")
class ConversationController {

    private final MessagingFacade messagingFacade;

    @GetMapping("id")
    public Long getConversationIdByAdvertisementIdAndSender(@RequestParam UUID advertisementId, Authentication authentication) {
        return messagingFacade.getConversationIdByAdvIdAndSender(advertisementId, authentication.getName());
    }

    @GetMapping
    public List<ConversationDTO> getAllConversations(Authentication authentication) {
        AppUser loggedUser = (AppUser) authentication.getPrincipal();
        return messagingFacade.getConversations(loggedUser);
    }
}

