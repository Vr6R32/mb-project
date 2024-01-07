package pl.motobudzet.api.z_configuration.securty_jwt;


import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import pl.motobudzet.api.z_configuration.security_basic.UserDetailsServiceImpl;
import pl.motobudzet.api.z_configuration.securty_jwt.token.TokenRepository;

import java.io.IOException;
import java.util.Arrays;

import static pl.motobudzet.api.z_configuration.securty_jwt.SecurityConfig.WHITE_LIST_URL;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter  {

    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;
    private final TokenRepository tokenRepository;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {

        if (isRequestWhiteListed(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        if (areTokensMissing(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            processAuthentication(request, response, filterChain);
        } catch (UnsupportedJwtException | MalformedJwtException | SignatureException | IllegalArgumentException e) {
            log.warn(e.getMessage());
            filterChain.doFilter(request, response);
        }
    }

    private boolean isRequestWhiteListed(HttpServletRequest request){
        String path = request.getServletPath();

        return Arrays.stream(WHITE_LIST_URL)
                .anyMatch(whiteListedPath -> path.matches(whiteListedPath.replace("**", ".*")));
    }

    private boolean areTokensMissing(HttpServletRequest request) {
        RequestCookies requestCookies = RequestCookies.extractCookiesFromRequest(request.getCookies());
        return requestCookies.accessToken() == null && requestCookies.refreshToken() == null;
    }

    private void processAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        RequestCookies requestCookies = RequestCookies.extractCookiesFromRequest(request.getCookies());
        String accessToken = requestCookies.accessToken();
        String refreshToken = requestCookies.refreshToken();

        String decryptedAccessToken = null;
        String decryptedRefreshToken = null;

        try {
            if (accessToken != null) {
                decryptedAccessToken = jwtService.decryptToken(accessToken);
            }
            if (refreshToken != null) {
                decryptedRefreshToken = jwtService.decryptToken(refreshToken);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        if (decryptedAccessToken == null && decryptedRefreshToken != null) {
            handleRefreshTokenAuthentication(request, response, filterChain, decryptedRefreshToken);
            return;
        }

        try {
            if (decryptedAccessToken != null) {
                authenticateAccessToken(request, response, filterChain, decryptedAccessToken);
            }
        } catch (ExpiredJwtException e) {
            if (decryptedRefreshToken != null) {
                handleRefreshTokenAuthentication(request, response, filterChain, decryptedRefreshToken);
            } else {
                throw e;
            }
        }
    }
    private void authenticateAccessToken(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain, String accessToken) throws IOException, ServletException {
        String username = jwtService.extractUsername(accessToken);
        authenticate(request, response, filterChain, accessToken, username);
    }

    private void handleRefreshTokenAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain, String refreshToken) throws IOException, ServletException {
        String refreshedAccessToken = jwtService.refreshToken(refreshToken,response);
        authenticateAccessToken(request, response, filterChain, refreshedAccessToken);
    }

    private void authenticate(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain, String accessToken, String username) throws IOException, ServletException {
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        if (isTokenValid(accessToken, userDetails)) {
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }
        filterChain.doFilter(request, response);
    }

    private boolean isTokenValid(String accessToken, UserDetails userDetails) {
        return tokenRepository.findByToken(accessToken)
                .map(t -> !t.isExpired() && !t.isRevoked() && jwtService.isTokenValid(accessToken, userDetails))
                .orElse(false);
    }
}
