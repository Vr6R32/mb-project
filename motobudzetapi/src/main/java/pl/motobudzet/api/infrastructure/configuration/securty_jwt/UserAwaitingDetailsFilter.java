package pl.motobudzet.api.infrastructure.configuration.securty_jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class UserAwaitingDetailsFilter extends OncePerRequestFilter {

    private static final String ROLE_AWAITING_DETAILS = "ROLE_AWAITING_DETAILS";
    private static final String REDIRECT_URL = "/user/details";
    private static final String UPDATE_DETAILS_URL = ("/api/user/confirm/**");

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String requestURI = request.getRequestURI();
        boolean isStaticResource = requestURI.startsWith("/css/") || requestURI.startsWith("/js/") ||
                requestURI.startsWith("/api/resources/logo") || requestURI.startsWith("/logout") ||
                requestURI.startsWith("/api/cities") || requestURI.startsWith("/api/user/updateDetails");

        if (!isStaticResource && authentication != null && authentication.isAuthenticated()
                && hasAwaitingDetailsRole(authentication)
                && !requestURI.equals(REDIRECT_URL)
                && !requestURI.equals(UPDATE_DETAILS_URL)) {
            response.sendRedirect(REDIRECT_URL);
        }

        filterChain.doFilter(request, response);
    }

    private boolean hasAwaitingDetailsRole(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(ROLE_AWAITING_DETAILS::equals);
    }
}
