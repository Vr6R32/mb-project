package pl.motobudzet.mailingmodule;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
public class MailingModuleApplication {

    public static void main(String[] args) {
        SpringApplication.run(MailingModuleApplication.class, args);
    }
}
