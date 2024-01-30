package pl.motobudzet.api.utils.adv_clone;

import com.fasterxml.jackson.databind.JsonNode;

import java.util.ArrayList;
import java.util.List;

public class JsonObjectExtractor {

    private JsonObjectExtractor() {
    }

    public static List<String> extractImageUrls(JsonNode jsonResponse) {
        JsonNode imagesNode = jsonResponse.get("images");
        List<String> photoUrls = null;
        if (imagesNode != null && imagesNode.has("photos")) {
            JsonNode photos = imagesNode.get("photos");
            photoUrls = new ArrayList<>();
            for (JsonNode photo : photos) {
                if (photo.has("url")) {
                    photoUrls.add(photo.get("url").asText());
                }
            }
        }
        return photoUrls;
    }

    public static String extractTitle(JsonNode jsonResponse) {
        JsonNode titleNode = jsonResponse.get("title");
        return titleNode.asText();
    }

    public static String extractPrice(JsonNode jsonResponse) {
        JsonNode priceNode = jsonResponse.get("price").get("value");
        return priceNode.asText();
    }

    public static String extractCurrency(JsonNode jsonResponse) {
        JsonNode currencyNode = jsonResponse.get("price").get("currency");
        return currencyNode.asText();
    }

    public static String extractPhoneNumber(JsonNode jsonResponse) {
        JsonNode phoneNumberNode = jsonResponse.get("phoneNumbers").get(0);
        return phoneNumberNode.asText();
    }

    public static String extractDescription(JsonNode jsonResponse) {
        JsonNode descriptionNode = jsonResponse.get("description");
        return descriptionNode.asText();
    }
}
