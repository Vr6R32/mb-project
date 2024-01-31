package pl.motobudzet.api.domain.messages;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pl.motobudzet.api.domain.user.entity.AppUser;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "api/messages")
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<String> sendMessage(@RequestParam String message, @RequestParam UUID advertisementId, Authentication authentication) {
        AppUser loggedUser = (AppUser) authentication.getPrincipal();

        String response = messageService.sendMessage(message,advertisementId,loggedUser);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping
    public List<MessageDTO> getAllMessages(@RequestParam Long conversationId, Principal principal) {
        return messageService.getAllMessages(conversationId, principal.getName());
    }
}

