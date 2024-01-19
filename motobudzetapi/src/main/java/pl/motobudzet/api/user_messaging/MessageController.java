package pl.motobudzet.api.user_messaging;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import pl.motobudzet.api.user_account.entity.AppUser;

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
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        AppUser user = ((AppUser) userDetails);

        String response = messageService.sendMessage(message,advertisementId,user);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping
    public List<MessageDTO> getAllMessages(@RequestParam Long conversationId, Principal principal) {
        return messageService.getAllMessages(conversationId, principal.getName());
    }
}

