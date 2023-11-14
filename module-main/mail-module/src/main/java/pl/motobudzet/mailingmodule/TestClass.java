package pl.motobudzet.mailingmodule;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import pl.motobudzet.api.emailSender.dto.EmailMessageRequest;
import pl.motobudzet.mailingmodule.mailSender.service.SpringMailSenderService;
//import pl.motobudzet.mailingmodule.mailSender.service.SpringMailSenderService;

@Component
@RequiredArgsConstructor
public class TestClass {

    private final SpringMailSenderService mailSenderService;
//    private final JavaMailSenderService mailSenderService;

//    @EventListener(ApplicationReadyEvent.class)
    public void sendTestEmail(){
        System.out.println("test");

        EmailMessageRequest request = EmailMessageRequest.builder()
                .advertisementTitle("IGLA KOZAK MERCEDES")
                .advertisementId("123123")
                .receiverEmail("kowalkowski.michal24@gmail.com")
                .senderName("piesnababy69")
                .message("Witam jestem zainteresowany samochodem, czy mozna pojechac ze szwagrem i miernikiem?")
                .build();
        mailSenderService.sendMessageNotificationHtml(request);

    }

}
