package pl.motobudzet.api.infrastructure.configuration.security;


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
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import pl.motobudzet.api.domain.user.entity.AppUser;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

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

        if (areHttpCookieTokensMissing(request)) {
            processBearerTokenAuthorization(request,response,filterChain);
            return;
        }

        try {
            processHttpCookieTokenAuthorization(request, response, filterChain);
        } catch (UnsupportedJwtException | MalformedJwtException | SignatureException | IllegalArgumentException e) {
            log.warn(e.getMessage());
            filterChain.doFilter(request, response);
        }
    }

    private void setInternalServiceAuthorization(HttpServletRequest request) {
        AppUser principal = AppUser.builder().userName("monitoring").id(1L).build();
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_MONITORING"));
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                principal, null, authorities);
        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authToken);
    }

    private void processHttpCookieTokenAuthorization(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException {
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


    private void processBearerTokenAuthorization(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {

        String accessToken;
        String authorization = request.getHeader("Authorization");

        if(authorization == null){
            filterChain.doFilter(request,response);
            return;
        }

        if(authorization.contains("Bearer")){
            accessToken = authorization.substring(7);
        } else {
            filterChain.doFilter(request,response);
            return;
        }

        if(accessToken.contains("prometheus9090auth")){
            setInternalServiceAuthorization(request);
            filterChain.doFilter(request,response);
            return;
        }

        String decryptedAccessToken = jwtService.decryptToken(accessToken);

        try {
            if (decryptedAccessToken != null) {
                authenticateAccessToken(request, response, filterChain, decryptedAccessToken);
            }
        } catch (ExpiredJwtException e) {
            clearTokensAndSendRedirect(response);
        }
    }


    private boolean isRequestWhiteListed(String path) {
        return Arrays.stream(SecurityConfig.WHITE_LIST_URL)
                .anyMatch(whiteListedPath -> path.matches(whiteListedPath.replace("**", ".*")));
    }

    private boolean areHttpCookieTokensMissing(HttpServletRequest request) {
        RequestCookies requestCookies = RequestCookies.extractCookiesFromRequest(request.getCookies());
        return requestCookies.accessToken() == null && requestCookies.refreshToken() == null;
    }

    private void clearTokensAndSendRedirect(HttpServletResponse response) throws IOException {
        response.sendRedirect("/login");
        HttpHeaders httpHeaders = jwtService.buildHttpTokenHeaders("", "", 0, 0);
        jwtService.applyHttpHeaders(response, httpHeaders);
    }

    private void authenticateAccessToken(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain, String accessToken) {
        try {
            authenticate(request, response, filterChain, accessToken);
        } catch (IOException | ServletException e) {
            throw new RuntimeException(e);
        }
    }

    private void handleRefreshTokenAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain, String refreshToken) {
        String refreshedAccessToken = jwtService.refreshToken(refreshToken, response);
        authenticateAccessToken(request, response, filterChain, refreshedAccessToken);
    }

    private void authenticate(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain, String accessToken) throws IOException, ServletException {

        // TODO : think is it okay to pass user data without fetching user from db ? it saves db usage and in general we have all needed user data from token
        //        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        Collection<? extends GrantedAuthority> authorities = jwtService.extractAuthorities(accessToken);
        Long userId = jwtService.extractUserId(accessToken);
        String userEmail = jwtService.extractUserEmail(accessToken);
        String username = jwtService.extractUsername(accessToken);

        AppUser principal = AppUser.builder()
                .userName(username)
                .id(userId)
                .email(userEmail)
                .build();

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                principal, null, authorities);
        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authToken);
        filterChain.doFilter(request, response);
    }
}
