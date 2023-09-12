package pl.motobudzet.api.utils;

import pl.motobudzet.api.user_conversations.entity.ConversationMessage;

import java.util.List;

public class UserAuthorization {
    private UserAuthorization() {
    }

    public static boolean authorizeMessageGetAccess(List<ConversationMessage> conversationMessageList, String loggedUser) {
        return loggedUser.equals(conversationMessageList.stream().findFirst().orElseThrow(() -> new RuntimeException("No messages found!")).getConversation().getUserOwner().getUsername()) ||
                loggedUser.equals(conversationMessageList.stream().findFirst().orElseThrow(() -> new RuntimeException("No messages found!")).getConversation().getUserClient().getUsername());
    }

    public static boolean authorizeMessagePostAccess(String loggedUser, String userNameOwner, String userNameClient) {
        return loggedUser.equals(userNameClient) || loggedUser.equals(userNameOwner);
    }
}
