package pl.motobudzet.mailingmodule.mailSender.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@EnableScheduling
public class NotificationCleanupScheduler {

    private final SpringMailSenderService mailSenderService;

//    @Scheduled(cron = "0 0 4 * * ?") // Uruchamia codziennie o 4 rano
//    @Scheduled(cron = "13 10 * * * *") // Uruchamia codziennie o 10:13
//    @Scheduled(cron = "0 * * * * *") // Uruchamia co minutę
//    @Scheduled(cron = "0 */23 * * * *") // Uruchamia co 23 minuty
//    @Scheduled(cron = "0 */2 * * * *") // Uruchamia co 2 minuty
    @Scheduled(cron = "0 0 * * * *") // Uruchamia co godzinę
    public void cleanupMessageRequestList() {
        mailSenderService.getMessageRequestList().clear();
    }
}