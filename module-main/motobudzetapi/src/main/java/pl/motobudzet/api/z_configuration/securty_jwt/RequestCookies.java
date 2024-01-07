package pl.motobudzet.api.z_configuration.securty_jwt;

import jakarta.servlet.http.Cookie;

public record RequestCookies(String accessToken, String refreshToken) {

    public static RequestCookies extractCookiesFromRequest(Cookie[] cookies) {
        String accessToken = null;
        String refreshToken = null;

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("accessToken".equals(cookie.getName())) {
                    accessToken = cookie.getValue();
                } else if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                }
                if (accessToken != null && refreshToken != null) {
                    break;
                }
            }
        }

        return new RequestCookies(accessToken, refreshToken);
    }

}