package pl.motobudzet.api.utils.adv_clone;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

import static pl.motobudzet.api.utils.adv_clone.HtmlStringExtractor.*;
import static pl.motobudzet.api.utils.adv_clone.JsonObjectExtractor.*;

@Service
@RequiredArgsConstructor
public class AdvCloneService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public List<String> cloneThirdPartyAdvertisement(String url) {
        JsonNode jsonResponse = fetchAdvertisement(url);

//        return jsonResponse;
        return extractJsonProperties(jsonResponse);
    }

    private List<String> extractJsonProperties(JsonNode jsonResponse) {
        String title = extractTitle(jsonResponse);
        String price = extractPrice(jsonResponse);
        String currency = extractCurrency(jsonResponse);
        String phoneNumber = extractPhoneNumber(jsonResponse);
        String description = extractDescription(jsonResponse);
        List<String> imageUrls = extractImageUrls(jsonResponse);

        return List.of(title, price, currency, phoneNumber, description);
    }

    public JsonNode fetchAdvertisement(String url) {
        String response = performGetRequest(url);
        return mapToJsonObject(response).get("props").get("pageProps").get("advert");
    }

    public String performGetRequest(String url) {
        String response = restTemplate.getForObject(url, String.class);
        return extractStringifiedJsonFromHtml(response);
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