package pl.motobudzet.api.infrastructure.mailing;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.motobudzet.api.model.EmailNotificationRequest;

@RestController
@RequestMapping("api/kafka")
@RequiredArgsConstructor
public class KafkaMessageTestController {

    private final KafkaSenderService kafkaSenderService;
    @PostMapping("/send")
    public String sendMessage(@RequestBody EmailNotificationRequest request) {
        kafkaSenderService.sendMessage(request);
        return "Message sent to the Kafka topic mailing-service successfully";
    }
}