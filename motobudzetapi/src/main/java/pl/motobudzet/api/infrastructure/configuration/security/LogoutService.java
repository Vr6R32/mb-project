package pl.motobudzet.api.infrastructure.configuration.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.infrastructure.configuration.security.token.TokenRepository;


@Service
@RequiredArgsConstructor
public class LogoutService implements LogoutHandler {

    private final TokenRepository tokenRepository;
    private final JwtService jwtService;

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        RequestCookies requestCookies = RequestCookies.extractCookiesFromRequest(request.getCookies());
        tokenRepository.setTokensExpiredAndRevoked(requestCookies.accessToken(), requestCookies.refreshToken());
        HttpHeaders httpHeaders = jwtService.buildHttpTokenHeaders("", "", 0, 0);
        jwtService.applyHttpHeaders(response, httpHeaders);
        SecurityContextHolder.clearContext();
    }
}

