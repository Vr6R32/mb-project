package pl.motobudzet.api.z_configuration.securty_jwt;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
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

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;
    private final TokenRepository tokenRepository;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {

        if (handleWhiteList(request, response, filterChain)) return;

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

        if (accessToken == null) {
            filterChain.doFilter(request, response);
            return;
        }
        String username = null;

        try {
            username = jwtService.extractUsername(accessToken);
        } catch (ExpiredJwtException e) {
            filterChain.doFilter(request, response);
        }


        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            var isTokenValid = tokenRepository.findByToken(accessToken)
                    .map(t -> !t.isExpired() && !t.isRevoked())
                    .orElse(false);

            if (jwtService.isTokenValid(accessToken, userDetails) && isTokenValid) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }

    private boolean handleWhiteList(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        String path = request.getServletPath();

        boolean isPathWhiteListed = Arrays.stream(WHITE_LIST_URL)
                .anyMatch(whiteListedPath -> path.matches(whiteListedPath.replace("**", ".*")));

        if (isPathWhiteListed) {
            filterChain.doFilter(request, response);
            return true;
        }
        return false;
    }
}
