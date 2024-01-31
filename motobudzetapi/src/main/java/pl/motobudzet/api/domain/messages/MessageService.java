package pl.motobudzet.api.domain.messages;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.infrastructure.mailing.EmailMessageRequest;
import pl.motobudzet.api.infrastructure.mailing.SpringMailSenderService;
import pl.motobudzet.api.infrastructure.mapper.MessageMapper;
import pl.motobudzet.api.domain.user.entity.AppUser;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final ConversationService conversationService;
    private final MessagesRepository messagesRepository;
    private final SpringMailSenderService springMailSenderService;

    public String sendMessage(String message, UUID advertisementId, AppUser user) {

        Conversation conversation = findConversationOrCreateNew(advertisementId, user);

        String messageSenderName = user.getUsername();
        AppUser conversationUserClient = conversation.getUserClient();
        AppUser conversationUserOwner = conversation.getUserOwner();
        String lastMessageUserName = getLastMessageUserName(conversation);

        if (authorizeMessagePostAccess(messageSenderName, conversationUserOwner.getUsername(), conversationUserClient.getUsername())) {
            Message newMessage = Message.builder()
                    .conversation(conversation)
                    .message(message)
                    .messageSendDateTime(LocalDateTime.now())
                    .messageSender(user)
                    .build();

            updateConversation(conversation, newMessage);
            messagesRepository.save(newMessage);

            AppUser emailNotificationReceiver = conversationUserClient.getUsername().equals(messageSenderName) ? conversationUserOwner : conversationUserClient;
            if (lastMessageUserName == null || !Objects.equals(lastMessageUserName, messageSenderName)) {
                sendEmailMessageNotificationAsync(message, emailNotificationReceiver, user, conversation);
            }
            return "Message Sent!";
        } else {
            return "Error while sending a message!";
        }
    }

    private String getLastMessageUserName(Conversation conversation) {
        String lastMessageUserName = null;
        if (conversation.getLastMessage() != null) {
            lastMessageUserName = conversation.getLastMessage().getMessageSender().getUsername();
        }
        return lastMessageUserName;
    }

    private Conversation findConversationOrCreateNew(UUID advertisementId, AppUser user) {
        Conversation conversation = conversationService.findConversationByAdvertisementIdAndUserSender(advertisementId, user);

        if(conversation==null){
            conversation = conversationService.createConversation(advertisementId, user);
        }
        return conversation;
    }

    private void updateConversation(Conversation conversation, Message newMessage) {
        if (conversation.getMessages() == null) {
            conversation.setMessages(List.of(newMessage));
        } else {
            List<Message> messageList = conversation.getMessages();
            messageList.add(newMessage);
            conversation.setMessages(messageList);
        }
        conversation.setLastMessage(newMessage);
    }

    private void sendEmailMessageNotificationAsync(String message, AppUser emailNotificationReceiver, AppUser messageSender, Conversation conversation) {
        EmailMessageRequest emailMessageRequest = EmailMessageRequest.builder()
                .message(message)
                .senderName(messageSender.getUsername())
                .receiverEmail(emailNotificationReceiver.getEmail())
                .advertisementTitle(conversation.getAdvertisement().getName())
                .advertisementId(String.valueOf(conversation.getAdvertisement().getId()))
                .build();
        springMailSenderService.sendMessageNotificationHtml(emailMessageRequest);
    }


    public List<MessageDTO> getAllMessages(Long conversationId, String loggedUser) {
        List<Message> messagesList = messagesRepository.getAllMessages(conversationId);
        if (messagesList.isEmpty()) return Collections.emptyList();
        if (authorizeMessageGetAccess(messagesList, loggedUser)) {
            updateMessagesRead(loggedUser, messagesList);
            return messagesList
                    .stream().map(MessageMapper::mapToMessageDTO).toList();
        }
        return Collections.emptyList();
    }

    private void updateMessagesRead(String loggedUser, List<Message> messagesList) {

        for (Message message : messagesList) {
            String messageSenderUsername = message.getMessageSender().getUsername();
            if (!loggedUser.equals(messageSenderUsername) && (message.getMessageReadDateTime() == null)) {
                    message.setMessageReadDateTime(LocalDateTime.now());
            }
        }
        messagesRepository.saveAll(messagesList);
    }

    private boolean authorizeMessageGetAccess(List<Message> messageList, String loggedUser) {
        return loggedUser.equals(messageList.stream().findFirst().orElseThrow(() -> new RuntimeException("No messages found!")).getConversation().getUserOwner().getUsername()) ||
                loggedUser.equals(messageList.stream().findFirst().orElseThrow(() -> new RuntimeException("No messages found!")).getConversation().getUserClient().getUsername());
    }

    private boolean authorizeMessagePostAccess(String loggedUser, String userNameOwner, String userNameClient) {
        return loggedUser.equals(userNameClient) || loggedUser.equals(userNameOwner);
    }
}
