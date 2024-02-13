package pl.motobudzet.api.domain.messaging;

import pl.motobudzet.api.adapter.facade.AdvertisementFacade;
import pl.motobudzet.api.adapter.facade.EmailManagerFacade;
import pl.motobudzet.api.persistance.ConversationRepository;
import pl.motobudzet.api.persistance.MessageRepository;

public class FactoryMessagingService {

    private FactoryMessagingService() {
    }

    public static MessagingService createMessagingService(ConversationRepository conversationRepository, MessageRepository messageRepository, EmailManagerFacade emailManagerFacade, AdvertisementFacade advertisementFacade) {
        return new MessagingServiceImpl(conversationRepository, messageRepository, emailManagerFacade, advertisementFacade);
    }
}
