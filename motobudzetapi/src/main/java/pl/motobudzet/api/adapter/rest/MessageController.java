package pl.motobudzet.api.adapter.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pl.motobudzet.api.domain.messaging.MessageDTO;
import pl.motobudzet.api.adapter.facade.MessagingFacade;
import pl.motobudzet.api.domain.user.entity.AppUser;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "api/messages")
class MessageController {

    private final MessagingFacade messagingFacade;

    @PostMapping
    public ResponseEntity<String> sendMessage(@RequestParam String message, @RequestParam UUID advertisementId, Authentication authentication) {
        AppUser loggedUser = (AppUser) authentication.getPrincipal();

        String response = messagingFacade.sendMessage(message,advertisementId,loggedUser);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping
    public List<MessageDTO> getAllMessages(@RequestParam Long conversationId, Principal principal) {
        return messagingFacade.getConversationMessages(conversationId, principal.getName());
    }
}

