package pl.motobudzet.api.z_configuration.securty_jwt;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.z_configuration.securty_jwt.token.TokenRepository;

@Service
@RequiredArgsConstructor
public class LogoutService implements LogoutHandler {

    private final TokenRepository tokenRepository;
    private final JwtService jwtService;

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {

        RequestCookies requestCookies = RequestCookies.extractCookiesFromRequest(request.getCookies());

        try {
            tokenRepository.setTokensExpiredAndRevoked(jwtService.decryptToken(requestCookies.accessToken()), jwtService.decryptToken(requestCookies.refreshToken()));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        HttpHeaders httpHeaders = jwtService.buildHttpTokenHeaders("", "", 0, 0);
        jwtService.applyHttpHeaders(response, httpHeaders);

        SecurityContextHolder.clearContext();
    }
}

