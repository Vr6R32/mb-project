package pl.motobudzet.api.adapter.facade.config;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pl.motobudzet.api.adapter.facade.AdvertisementFacade;
import pl.motobudzet.api.adapter.facade.MessagingFacade;
import pl.motobudzet.api.domain.messaging.FactoryMessagingService;
import pl.motobudzet.api.domain.messaging.MessagingService;
import pl.motobudzet.api.adapter.facade.EmailManagerFacade;
import pl.motobudzet.api.persistance.ConversationRepository;
import pl.motobudzet.api.persistance.MessageRepository;

@Configuration
@AllArgsConstructor
class MessagingFacadeConfiguration {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final EmailManagerFacade mailService;
    private final AdvertisementFacade advertisementFacade;

    @Bean
    public MessagingFacade messagingFacade() {
        MessagingService messagingService = FactoryMessagingService.createMessagingService(conversationRepository,messageRepository,mailService,advertisementFacade);
        return new MessagingFacade(messagingService);
    }

}
