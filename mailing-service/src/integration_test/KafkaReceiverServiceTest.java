import com.github.dockerjava.api.model.ExposedPort;
import com.github.dockerjava.api.model.PortBinding;
import com.github.dockerjava.api.model.Ports;
import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.serializer.JsonSerializer;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.containers.KafkaContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;
import pl.motobudzet.api.model.EmailNotificationRequest;
import pl.motobudzet.api.model.EmailType;
import pl.motobudzet.mailingmodule.KafkaReceiverService;
import pl.motobudzet.mailingmodule.MailingModuleApplication;

import java.util.*;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.testcontainers.shaded.org.awaitility.Awaitility.await;
import static pl.motobudzet.mailingmodule.KafkaConsumerConfig.MAILING_TOPIC;

@Testcontainers
@SpringBootTest(classes = MailingModuleApplication.class, webEnvironment = SpringBootTest.WebEnvironment.NONE)
@ActiveProfiles(value = "test")
class KafkaReceiverServiceTest {


    @SpyBean
    KafkaReceiverService kafkaReceiverService;

    @AfterAll
    static void tearDown() {
        kafkaContainer.stop();
    }

    @Container
    static KafkaContainer kafkaContainer = new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:7.0.2"))
            .withEnv(Map.of(
                    "KAFKA_HEAP_OPTS", "-Xmx384m -Xms384m",
                    "KAFKA_BROKER_ID", "1",
                    "KAFKA_LISTENER_SECURITY_PROTOCOL_MAP", "PLAINTEXT:PLAINTEXT,BROKER:PLAINTEXT",
                    "KAFKA_INTER_BROKER_LISTENER_NAME", "PLAINTEXT",
                    "KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR", "1",
                    "KAFKA_COMPRESSION_TYPE", "gzip"
            ))
            .withCreateContainerCmdModifier(cmd -> Objects.requireNonNull(cmd.getHostConfig()).withPortBindings(
                    new PortBinding(Ports.Binding.bindPort(9093), new ExposedPort(9093)),
                    new PortBinding(Ports.Binding.bindPort(2181), new ExposedPort(2181))
            ));


    public ProducerFactory<String, Object> producerFactory() {
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, kafkaContainer.getBootstrapServers());
        configProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        configProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        return new DefaultKafkaProducerFactory<>(configProps);
    }


    @Test
    void testProduceAndConsumeKafkaMessage() throws InterruptedException {

        //given

        kafkaContainer.start();

        AdminClient adminClient = AdminClient.create(Map.of("bootstrap.servers", kafkaContainer.getBootstrapServers()));

        NewTopic mailingTopic = TopicBuilder.name(MAILING_TOPIC)
                .replicas(1)
                .partitions(1)
                .build();

        adminClient.createTopics(List.of(mailingTopic));

        EmailNotificationRequest notificationRequest = new EmailNotificationRequest(
                EmailType.MANAGEMENT_NOTIFICATION, "message", "sender", UUID.randomUUID(),
                "title", "model", "brand", "username", "registerCode", "resetCode", List.of("mockey@mock.pl"));

        KafkaTemplate<String, Object> kafkaTemplate = new KafkaTemplate<>(producerFactory());

        Thread.sleep(1000);

        //when

        kafkaTemplate.send(MAILING_TOPIC, notificationRequest);

        // then

        await().atMost(10, TimeUnit.SECONDS).untilAsserted(() -> {

            ArgumentCaptor<EmailNotificationRequest> argumentCaptor = ArgumentCaptor.forClass(EmailNotificationRequest.class);
            verify(kafkaReceiverService, times(1)).listen(argumentCaptor.capture());

            EmailNotificationRequest capturedRequest = argumentCaptor.getValue();

            assertThat(capturedRequest).isEqualToComparingFieldByField(notificationRequest);
        });

    }
}

