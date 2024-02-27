package pl.motobudzet.mailingmodule.dev;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@Profile("docker")
@RequiredArgsConstructor
public class KafkaDevController {

    private final KafkaDevService kafkaDevService;

    @GetMapping("/topics")
    public ResponseEntity<Set<String>> listTopics() {
        Set<String> topicNames = kafkaDevService.listTopics();
        return new ResponseEntity<>(topicNames, HttpStatus.OK);
    }

    @GetMapping("/topics/{topicName}")
    public ResponseEntity<List<String>> getTopicMessages(@PathVariable String topicName) {
        List<String> messages = kafkaDevService.getTopicMessages(topicName);
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }
}

