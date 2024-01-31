package pl.motobudzet.api.infrastructure.adv_clone;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdvCloneService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public JsonNode cloneThirdPartyAdvertisement(String url) {
        JsonNode jsonResponse = fetchAdvertisement(url);

        return jsonResponse;
//        return extractJsonProperties(jsonResponse);
    }

    private List<String> extractJsonProperties(JsonNode jsonResponse) {
        String title = JsonObjectExtractor.extractTitle(jsonResponse);
        String price = JsonObjectExtractor.extractPrice(jsonResponse);
        String currency = JsonObjectExtractor.extractCurrency(jsonResponse);
        String phoneNumber = JsonObjectExtractor.extractPhoneNumber(jsonResponse);
        String description = JsonObjectExtractor.extractDescription(jsonResponse);
        List<String> imageUrls = JsonObjectExtractor.extractImageUrls(jsonResponse);

        return List.of(title, price, currency, phoneNumber, description);
    }

    public JsonNode fetchAdvertisement(String url) {
        String response = performGetRequest(url);
        return mapToJsonObject(response).get("props").get("pageProps").get("advert");
    }

    public String performGetRequest(String url) {
        String response = restTemplate.getForObject(url, String.class);
        return HtmlStringExtractor.extractStringifiedJsonFromHtml(response);
    }

    public JsonNode mapToJsonObject(String json) {
        try {
            return objectMapper.readTree(json);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}