package pl.motobudzet.api.user_messaging;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.emailSender.EmailMessageRequest;
import pl.motobudzet.api.emailSender.SpringMailSenderService;
import pl.motobudzet.api.mappers.MessageMapper;
import pl.motobudzet.api.user_account.entity.AppUser;
import pl.motobudzet.api.user_account.service.AppUserCustomService;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final AppUserCustomService userCustomService;
    private final ConversationService conversationService;
    private final MessagesRepository messagesRepository;
//    private final KafkaServiceInterface kafkaService;
    private final SpringMailSenderService springMailSenderService;

    public String sendMessage(String message, Long conversationId, String messageSenderName) {

        Conversation conversation = conversationService.findConversationById(conversationId);
        AppUser conversationUserClient = conversation.getUserClient();
        AppUser conversationUserOwner = conversation.getUserOwner();

        AppUser emailNotificationReceiver = conversationUserClient.getUsername().equals(messageSenderName) ? conversationUserOwner : conversationUserClient;
        AppUser messageSender = userCustomService.getUserByName(messageSenderName);

        String lastMessageUserName = conversation.getLastMessage().getMessageSender().getUsername();

        if (authorizeMessagePostAccess(messageSenderName, conversationUserOwner.getUsername(), conversationUserClient.getUsername())) {
            Message newMessage = Message.builder()
                    .conversation(conversation)
                    .message(message)
                    .messageSendDateTime(LocalDateTime.now())
                    .messageSender(messageSender)
                    .build();

            updateConversation(conversation, newMessage);
            messagesRepository.save(newMessage);
        }


        if (!Objects.equals(lastMessageUserName, messageSenderName)) {
            sendEmailMessageNotificationAsync(message, emailNotificationReceiver, messageSender, conversation);
        }

        return "Message Sent!";
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
                    .stream().map(MessageMapper::mapToMessageDTO).collect(Collectors.toList());
        }
        return null;
    }

    private void updateMessagesRead(String loggedUser, List<Message> messagesList) {

        for (Message message : messagesList) {
            String messageSenderUsername = message.getMessageSender().getUsername();
            if (!loggedUser.equals(messageSenderUsername)) {
                if (message.getMessageReadDateTime() == null) {
                    message.setMessageReadDateTime(LocalDateTime.now());
                }
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


//    private void sendEmailMessageNotificationToKafka(String message, AppUser emailNotificationReceiver, AppUser messageSender, Conversation conversation) {
//        EmailMessageRequest emailMessageRequest = EmailMessageRequest.builder()
//                .message(message)
//                .senderName(messageSender.getUsername())
//                .receiverEmail(emailNotificationReceiver.getEmail())
//                .advertisementTitle(conversation.getAdvertisement().getName())
//                .advertisementId(String.valueOf(conversation.getAdvertisement().getId()))
//                .build();
//        kafkaService.sendMessageNotification(emailMessageRequest);
//    }
}
