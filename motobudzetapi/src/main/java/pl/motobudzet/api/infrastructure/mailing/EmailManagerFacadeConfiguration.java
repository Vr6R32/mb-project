package pl.motobudzet.api.infrastructure.mailing;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import pl.motobudzet.api.infrastructure.configuration.PathsConfig;

@Configuration
@AllArgsConstructor
public class EmailManagerFacadeConfiguration {

    private final JavaMailSender mailSender;
    private final PathsConfig pathsConfig;

    @Bean
    EmailManagerFacade emailManagerFacade() {
        SpringMailSenderService mailSenderService = new SpringMailSenderService(mailSender, pathsConfig);
        return new EmailManagerFacade(mailSenderService);
    }
}
