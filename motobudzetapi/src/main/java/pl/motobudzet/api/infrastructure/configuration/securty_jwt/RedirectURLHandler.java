package pl.motobudzet.api.infrastructure.configuration.securty_jwt;

import jakarta.servlet.http.HttpServletRequest;

public class RedirectURLHandler {

    private RedirectURLHandler() {
    }

    public static String buildRedirectUrl(HttpServletRequest httpServletRequest, String endpoint) {
        String scheme = httpServletRequest.getHeader("X-Forwarded-Proto") != null ? httpServletRequest.getHeader("X-Forwarded-Proto") : httpServletRequest.getScheme();
        String serverName = httpServletRequest.getHeader("X-Forwarded-Host") != null ? httpServletRequest.getHeader("X-Forwarded-Host") : httpServletRequest.getServerName();
        String contextPath = httpServletRequest.getContextPath();
        return scheme + "://" + serverName + contextPath + endpoint;
    }
}
