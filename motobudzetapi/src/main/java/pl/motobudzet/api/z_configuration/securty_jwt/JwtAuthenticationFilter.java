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
import org.springframework.http.HttpHeaders;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import pl.motobudzet.api.user_account.entity.AppUser;
import pl.motobudzet.api.z_configuration.securty_jwt.token.TokenRepository;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collection;

import static pl.motobudzet.api.z_configuration.securty_jwt.SecurityConfig.WHITE_LIST_URL;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {

        if (isRequestWhiteListed(request.getServletPath())) {
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

    private void processAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        RequestCookies requestCookies = RequestCookies.extractCookiesFromRequest(request.getCookies());
        String accessToken = requestCookies.accessToken();
        String refreshToken = requestCookies.refreshToken();
        String decryptedAccessToken = null;
        String decryptedRefreshToken = null;

        if (accessToken != null) {
            decryptedAccessToken = jwtService.decryptToken(accessToken);
        }
        if (refreshToken != null) {
            decryptedRefreshToken = jwtService.decryptToken(refreshToken);
        }

        if (decryptedAccessToken == null && decryptedRefreshToken != null) {
            try {
                handleRefreshTokenAuthentication(request, response, filterChain, decryptedRefreshToken);
                return;
            } catch (ExpiredJwtException e) {
                clearTokensAndSendRedirect(response);
                return;
            }
        }
        try {
            if (decryptedAccessToken != null) {
                authenticateAccessToken(request, response, filterChain, decryptedAccessToken);
            }
        } catch (ExpiredJwtException e) {
            if (decryptedRefreshToken != null) {
                handleRefreshTokenAuthentication(request, response, filterChain, decryptedRefreshToken);
            }
        }
    }


    private boolean isRequestWhiteListed(String path) {
        return Arrays.stream(WHITE_LIST_URL)
                .anyMatch(whiteListedPath -> path.matches(whiteListedPath.replace("**", ".*")));
    }

    private boolean areTokensMissing(HttpServletRequest request) {
        RequestCookies requestCookies = RequestCookies.extractCookiesFromRequest(request.getCookies());
        return requestCookies.accessToken() == null && requestCookies.refreshToken() == null;
    }

    private void clearTokensAndSendRedirect(HttpServletResponse response) throws IOException {
        response.sendRedirect("/login");
        HttpHeaders httpHeaders = jwtService.buildHttpTokenHeaders("", "", 0, 0);
        jwtService.applyHttpHeaders(response, httpHeaders);
    }

    private void authenticateAccessToken(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain, String accessToken) throws IOException, ServletException {
        String username = jwtService.extractUsername(accessToken);
        authenticate(request, response, filterChain, accessToken, username);
    }

    private void handleRefreshTokenAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain, String refreshToken) throws IOException, ServletException {
        String refreshedAccessToken = jwtService.refreshToken(refreshToken, response);
        authenticateAccessToken(request, response, filterChain, refreshedAccessToken);
    }

    private void authenticate(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain, String accessToken, String username) throws IOException, ServletException {

        // TODO : think is it okay to pass user data without fetching user from db ?
//        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            Collection<? extends GrantedAuthority> authorities = jwtService.extractAuthorities(accessToken);
            Long userId = jwtService.extractUserId(accessToken);
            AppUser principal = AppUser.builder().userName(username).id(userId).build();
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    principal, null, authorities);
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
            filterChain.doFilter(request, response);
    }

//    private boolean isTokenValid(String accessToken) {
//        return tokenRepository.findByToken(accessToken)
////                .map(t -> !t.isExpired() && !t.isRevoked() && jwtService.isTokenValid(accessToken, userDetails))
//                .map(t -> !t.isExpired() && !t.isRevoked())
//                .orElse(false);
//    }
}
