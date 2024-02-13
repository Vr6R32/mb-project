package pl.motobudzet.api.infrastructure.configuration.security;

import jakarta.servlet.http.HttpServletRequest;

public class RedirectURLHandler {

    private RedirectURLHandler() {
    }

    public static String buildRedirectUrl(HttpServletRequest httpServletRequest, String endpoint) {
        String scheme = httpServletRequest.getHeader("X-Forwarded-Proto") != null ? httpServletRequest.getHeader("X-Forwarded-Proto") : httpServletRequest.getScheme();
        String serverName = httpServletRequest.getHeader("X-Forwarded-Host") != null ? httpServletRequest.getHeader("X-Forwarded-Host") : httpServletRequest.getServerName();
        String contextPath = httpServletRequest.getContextPath();

        if (serverName == null) {
            serverName = "localhost:20134";
        }

        if (serverName.equals("localhost") && scheme.equals("http")) {
            serverName = serverName + ":20134";
        }

        return scheme + "://" + serverName + contextPath + endpoint;
    }
}
