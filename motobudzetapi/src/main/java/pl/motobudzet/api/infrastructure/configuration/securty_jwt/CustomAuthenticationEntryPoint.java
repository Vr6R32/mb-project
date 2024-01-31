package pl.motobudzet.api.infrastructure.configuration.securty_jwt;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.io.IOException;

import static pl.motobudzet.api.infrastructure.configuration.securty_jwt.RedirectURLHandler.buildRedirectUrl;

public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        String requestedUrl = request.getRequestURI();
        String redirectUrl = buildRedirectUrl(request, "/login?redirect=") + requestedUrl;
        response.sendRedirect(redirectUrl);
    }

}