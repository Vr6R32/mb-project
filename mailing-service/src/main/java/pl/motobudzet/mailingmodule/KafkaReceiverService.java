package pl.motobudzet.mailingmodule;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.model.EmailNotificationRequest;

import static pl.motobudzet.mailingmodule.KafkaConsumerConfig.MAILING_SERVICE_GROUP;
import static pl.motobudzet.mailingmodule.KafkaConsumerConfig.MAILING_TOPIC;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaReceiverService {

    private final SpringMailSenderService mailService;

    @KafkaListener(topics = MAILING_TOPIC, groupId = MAILING_SERVICE_GROUP)
    public void listen(EmailNotificationRequest request) {

        switch (request.type()) {

            case RESET_PASS_CODE -> {
                log.info("[MAILING-SERVICE] Processing RESET_PASSWORD_CODE -> Email for: {}", request.receiverEmail());
                mailService.sendResetPasswordNotificationCodeLink(request);
            }
            case MESSAGE_NOTIFICATION -> {
                log.info("[MAILING-SERVICE] Processing ADVERT_MESSAGE_NOTIFICATION -> Email for: {}", request.receiverEmail());
                mailService.sendMessageNotification(request);
            }
            case ADV_ACTIVE_CONFIRMATION -> {
                log.info("[MAILING-SERVICE] Processing ADVERT_ACTIVE_CONFIRMATION -> Email for: {}", request.receiverEmail());
                mailService.sendAdvertisementActivationConfirmNotification(request);
            }
            case REGISTER_ACTIVATION -> {
                log.info("[MAILING-SERVICE] Processing REGISTER_ACTIVATION_LINK -> Email for: {}", request.receiverEmail());
                mailService.sendRegisterActivationNotification(request);
            }
            case MANAGEMENT_NOTIFICATION -> {
                log.info("[MAILING-SERVICE] Processing MANAGEMENT_NOTIFICATION -> Email for: {}", request.receiverEmail());
                mailService.sendEmailNotificationToManagement(request);
            }
            default -> log.warn("Unknown notification type: {}", request.type());

        }
    }
}