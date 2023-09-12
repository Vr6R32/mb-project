package pl.motobudzet.api.user_conversations.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.motobudzet.api.user_conversations.dto.ConversationMessageDTO;
import pl.motobudzet.api.user_conversations.service.MessageService;

import java.security.Principal;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "api/messages")
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<String> sendMessage(@RequestParam String message,
                                      @RequestParam String advertisementId,
                                      @RequestParam Long conversationId,
                                      Principal principal) {
        String response = messageService.sendMessage(message, advertisementId, conversationId, principal.getName());
        return new ResponseEntity<>(response, HttpStatus.OK); // Tutaj dodajemy 's' jako zawartość odpowiedzi
    }

    @GetMapping
    public List<ConversationMessageDTO> getAllMessages(@RequestParam Long conversationId,
                                                       Principal principal) {
        return messageService.getAllMessages(conversationId, principal.getName());
    }


}

