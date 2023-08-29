package pl.motobudzet.api.zconfiguration;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/yahoo")
@EnableScheduling
public class YahooFinanceController {

    public static final String AMC_URL = "https://finance.yahoo.com/quote/AMC?p=AMC&.tsrc=fin-srch";
    public static final String NKLA_URL = "https://finance.yahoo.com/quote/NKLA?p=NKLA&.tsrc=fin-srch";


    @GetMapping("amc")
//    @Scheduled(fixedRate = 6000)
    public String getAmcPrice(){
        RestTemplate restTemplate = new RestTemplate();

            ResponseEntity<String> exchange = restTemplate.exchange(AMC_URL, HttpMethod.GET, HttpEntity.EMPTY, String.class);
            String extractedText = null;
            String body = exchange.getBody();
            boolean containsFinStreamer = body.contains("<fin-streamer class=");

            if (containsFinStreamer) {
                int index = body.indexOf("<fin-streamer class=");
                int endIndex = body.indexOf("</fin-streamer>");
                if (index != -1) { // Sprawdzamy, czy znaleziono indeks
                    int startIndex = index + "<fin-streamer class=".length() + 174;
                    extractedText = body.substring(startIndex, endIndex);
                    System.out.println(extractedText);
                }
            }
        return extractedText;
        }

    @GetMapping("nkla")
    public String getNklaPrice(){
        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<String> exchange = restTemplate.exchange(NKLA_URL, HttpMethod.GET, HttpEntity.EMPTY, String.class);
        String extractedText = null;
        String body = exchange.getBody();
        boolean containsFinStreamer = body.contains("<fin-streamer class=");

        if (containsFinStreamer) {
            int index = body.indexOf("<fin-streamer class=");
            int endIndex = body.indexOf("</fin-streamer>");
            if (index != -1) { // Sprawdzamy, czy znaleziono indeks
                int startIndex = index + "<fin-streamer class=".length() + 174;
                extractedText = body.substring(startIndex, endIndex);
                System.out.println(extractedText);
            }
        }
        return extractedText;
    }
    }
