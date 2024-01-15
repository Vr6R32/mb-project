package pl.motobudzet.api.utils.adv_clone;

public class HtmlStringExtractor {

    public static String extractDescription(String url) {
        String startMarker = "class=\"ooa-1xkwsck e1336z0n2\">";
        String endMarker = "<style data-emotion=\"ooa 1kxpgnj\"";

        int startIndex = url.indexOf(startMarker);
        int endIndex = url.indexOf(endMarker);

        if (startIndex != -1 && endIndex != -1 && endIndex > startIndex) {
            return url.substring(startIndex + startMarker.length(), endIndex);
        } else {
            return "DESCRIPTION_NOT_FOUND";
        }
    }

    public static String extractStringifiedJsonFromHtml(String htmlContent) {

        String preStartMarker = "e1mnzv1y2";
        String startMarker = "{\"props\":";
        String endMarker = "\"financingSimulatorWidget\":";

        int preStartIndex = htmlContent.indexOf(preStartMarker);
        if (preStartIndex == -1) {
            return "Pre-start marker not found";
        }

        int jsonStartIndex = htmlContent.indexOf('>', preStartIndex) + 1;
        if (jsonStartIndex == 0) {
            return "Start of JSON not found";
        }

        int startIndex = htmlContent.indexOf(startMarker, jsonStartIndex);
        if (startIndex == -1) {
            return "Start marker not found";
        }

        int endIndex = htmlContent.indexOf(endMarker, startIndex);
        if (endIndex == -1) {
            return "End marker not found";
        }

        String extractedJson = htmlContent.substring(startIndex, endIndex);
        extractedJson = extractedJson.substring(0, extractedJson.length() - 1) + "}}}";

        return extractedJson;
    }
}
