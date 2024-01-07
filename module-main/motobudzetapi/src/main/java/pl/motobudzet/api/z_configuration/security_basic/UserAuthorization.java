package pl.motobudzet.api.z_configuration.security_basic;

import pl.motobudzet.api.user_messaging.entity.ConversationMessage;

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
