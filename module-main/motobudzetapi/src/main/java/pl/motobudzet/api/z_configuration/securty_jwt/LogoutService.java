package pl.motobudzet.api.z_configuration.securty_jwt;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.user_account.entity.AppUser;
import pl.motobudzet.api.z_configuration.securty_jwt.token.Token;
import pl.motobudzet.api.z_configuration.securty_jwt.token.TokenRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LogoutService implements LogoutHandler {

    private final TokenRepository tokenRepository;
    private final JwtService jwtService;

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {

        String accessToken = null;
        String refreshToken = null;
        Cookie[] cookies = request.getCookies();

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

        tokenRepository.setTokensExpiredAndRevoked(accessToken, refreshToken);
        HttpHeaders httpHeaders = jwtService.resetHttpTokenHeaders();
        jwtService.applyHttpHeaders(response,httpHeaders);

        SecurityContextHolder.clearContext();
    }
}

