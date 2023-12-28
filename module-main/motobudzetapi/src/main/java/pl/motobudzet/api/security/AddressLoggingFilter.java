package pl.motobudzet.api.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

public class AddressLoggingFilter extends OncePerRequestFilter {

    public static final List<String> IGNORED_PATHS = Arrays.asList("api/resources", "css/", "js/", "api/spec", "api/brands", "api/advertisements");

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String requestURI = request.getRequestURI();
        boolean shouldIgnore = IGNORED_PATHS.stream().anyMatch(requestURI::contains);

        if (shouldIgnore) {
            filterChain.doFilter(request, response);
        } else {
            logger.info("Method -> " + request.getMethod() + " : " + "URL -> " + "[" + requestURI + "]" + " : " + " IP -> " + request.getRemoteAddr());
            filterChain.doFilter(request, response);
        }
    }
}