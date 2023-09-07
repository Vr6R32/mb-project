package pl.motobudzet.api.user_conversations.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pl.motobudzet.api.user_conversations.dto.ConversationDTO;
import pl.motobudzet.api.user_conversations.entity.Conversation;
import pl.motobudzet.api.user_conversations.service.ConversationService;

import java.security.Principal;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "api/conversations")
public class ConversationController {

    private final ConversationService conversationService;

//    @GetMapping("api/conversations/{advertisementId}")
//    public Conversation getAllConversationsForAdvertisement(@PathVariable String advertisementId, String ownerName){
//        return conversationService.getAllConversationsForAdvertisement(advertisementId,ownerName);
//    }

    @PostMapping("create")
    public String createConversation(@RequestParam String advertisementId, Principal principal ){
        conversationService.createConversation(advertisementId,principal.getName());
        return null;
    }

    @GetMapping("seller/{ownerName}")
    public List<ConversationDTO> getAllUserSellerConversations(@PathVariable String ownerName){
        return conversationService.getAllUserSellerConversations(ownerName);
    }
    @GetMapping("buyer/{clientName}")
    public List<ConversationDTO> getAllUserBuyerConversations(@PathVariable String clientName){
        return conversationService.getAllUserBuyerConversations(clientName);
    }
    @GetMapping
    public List<ConversationDTO> getAllConversations(Principal userName){
        return conversationService.getAllConversations(userName.getName());
    }
}

