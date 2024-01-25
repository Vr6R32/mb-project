package pl.motobudzet.api.z_configuration.securty_jwt;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.RedirectStrategy;

import java.io.IOException;

public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    public CustomAuthenticationEntryPoint(RedirectStrategy redirectStrategy) {
        this.redirectStrategy = redirectStrategy;
    }

    private final RedirectStrategy redirectStrategy;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        String requestedUrl = request.getRequestURI();
        String scheme = request.getHeader("X-Forwarded-Proto");
        String serverName = request.getHeader("X-Forwarded-Host");
        String contextPath = request.getContextPath();
        String loginUrl = scheme + "://" + serverName + contextPath + "/login?redirect=" + requestedUrl;
        redirectStrategy.sendRedirect(request, response, loginUrl);
    }

}