package pl.motobudzet.api.adapter.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.motobudzet.api.adapter.facade.MessagingFacade;
import pl.motobudzet.api.domain.user.AppUser;
import pl.motobudzet.api.dto.ConversationDTO;

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

