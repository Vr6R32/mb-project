package pl.motobudzet.api.user_conversations.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.kafka.service.KafkaService;
import pl.motobudzet.api.user.entity.AppUser;
import pl.motobudzet.api.user.service.AppUserCustomService;
import pl.motobudzet.api.user_conversations.dto.ConversationMessageDTO;
import pl.motobudzet.api.user_conversations.entity.Conversation;
import pl.motobudzet.api.user_conversations.entity.ConversationMessage;
import pl.motobudzet.api.user_conversations.repository.ConversationMessagesRepository;
import pl.motobudzet.api.user_conversations.utils.MessageMapper;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import static pl.motobudzet.api.user_conversations.utils.UserAuthorization.authorizeMessageGetAccess;
import static pl.motobudzet.api.user_conversations.utils.UserAuthorization.authorizeMessagePostAccess;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final AppUserCustomService userCustomService;
    private final ConversationService conversationService;
    private final ConversationMessagesRepository messagesRepository;
    private final KafkaService kafkaService;

    public String sendMessage(String message, Long conversationId, String messageSender) {

        AppUser userSender = userCustomService.getByName(messageSender);
        Conversation conversation = conversationService.findConversationById(conversationId);
        String userNameClient = conversation.getUserClient().getUsername();
        String userNameOwner = conversation.getUserOwner().getUsername();


        if(authorizeMessagePostAccess(messageSender,userNameOwner,userNameClient)){
            ConversationMessage newMessage = ConversationMessage.builder()
                    .conversation(conversation)
                    .message(message)
                    .messageSendDateTime(LocalDateTime.now())
                    .messageSender(userSender)
                    .build();

            if (conversation.getConversationMessages() == null) {
                conversation.setConversationMessages(List.of(newMessage));
            } else {
                List<ConversationMessage> conversationMessageList = conversation.getConversationMessages();
                conversationMessageList.add(newMessage);
                conversation.setConversationMessages(conversationMessageList);
            }
            conversation.setLastMessage(newMessage);
            messagesRepository.save(newMessage);
        }
        kafkaService.sendMessageNotification(message);
        return "Message Sent!";
    }

    public List<ConversationMessageDTO> getAllMessages(Long conversationId, String loggedUser) {
        List<ConversationMessage> conversationMessagesList = messagesRepository.getAllMessages(conversationId);
        if (conversationMessagesList.isEmpty()) return Collections.emptyList();

        if(authorizeMessageGetAccess(conversationMessagesList, loggedUser)){
            updateMessagesRead(loggedUser, conversationMessagesList);
            return conversationMessagesList
                    .stream().map(MessageMapper::mapToConversationMessageDTO).collect(Collectors.toList());
        }
        return null;
    }

    private void updateMessagesRead(String loggedUser, List<ConversationMessage> conversationMessagesList) {
        LocalDateTime now = LocalDateTime.now();

        for (ConversationMessage conversationMessage : conversationMessagesList) {
            String messageSenderUsername = conversationMessage.getMessageSender().getUsername();
            if (!loggedUser.equals(messageSenderUsername)) {
                if (conversationMessage.getMessageReadDateTime() == null) {
                    conversationMessage.setMessageReadDateTime(now);
                }
            }
        }
        messagesRepository.saveAll(conversationMessagesList);
    }
}
