package pl.motobudzet.api.infrastructure.configuration.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.web.authentication.logout.SimpleUrlLogoutSuccessHandler;
import org.springframework.security.web.context.SecurityContextPersistenceFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;

import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;
import static pl.motobudzet.api.infrastructure.configuration.security.RedirectURLHandler.buildRedirectUrl;


@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class SecurityConfig {

    public static final String API_ADVERTISEMENTS_PATH = "/api/advertisements/**";
    public static final String ROLE_AWAITING_DETAILS = "AWAITING_DETAILS";
    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_MONITORING = "MONITORING";

    private final UserDetailsServiceImpl userDetailsService;
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final LogoutHandler logoutHandler;


    @Bean
    public static PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SimpleUrlLogoutSuccessHandler successLogoutHandler() {
        return new SimpleUrlLogoutSuccessHandler() {
            @Override
            public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
                String redirectUrl = buildRedirectUrl(request, "/login?logout=true");
                response.sendRedirect(redirectUrl);
            }
        };
    }


    static final String[] WHITE_LIST_URL = {
            "/api/v1/auth/**",
            "/css/**",
            "/js/**",
            "/v2/api-docs",
            "/v3/api-docs",
            "/v3/api-docs/**",
            "/swagger-resources",
            "/swagger-resources/**",
            "/configuration/ui",
            "/configuration/security",
            "/swagger-ui/**",
            "/webjars/**",
            "/swagger-ui.html",
            "/api/session/**",
            "/reset",
            "/apple-touch-icon-precomposed.png",
            "/login",
            "/register",
            "/api/kafka/send",
            "/favicon.ico",
            "/favicon",
            "/api/spec/**",
            "/api/models/**",
            "/api/cities",
            "/api/resources/logo",
            "/api/cities/states",
            "/api/brands",
            "/api/user/forgot",
            "/api/static/**",
            "/api/v1/clone/**",
            "/api/user/resetCode",
            "/api/user/register",
            "/api/user/confirm",
            "/api/user/resetPassword",
            "/api/advertisements/last-uploaded",
            "/api/advertisements/filter/count",
            "/api/advertisements/filter/search",
            "/test"};

    @Bean
    @SuppressWarnings("deprecation")
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(AbstractHttpConfigurer::disable)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(new AddressLoggingFilter(), SecurityContextPersistenceFilter.class)
                .addFilterAfter(new UserAwaitingDetailsFilter(), JwtAuthenticationFilter.class)
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers(WHITE_LIST_URL).permitAll()
                                .requestMatchers("/", "index", "advertisement").permitAll()
                                .requestMatchers(HttpMethod.GET, API_ADVERTISEMENTS_PATH).permitAll()

                                .requestMatchers("/user/details/**").hasRole(ROLE_AWAITING_DETAILS)
                                .requestMatchers("/api/user/updateDetails/**").hasRole(ROLE_AWAITING_DETAILS)

                                .requestMatchers(HttpMethod.PUT, API_ADVERTISEMENTS_PATH).authenticated()
                                .requestMatchers(HttpMethod.POST, API_ADVERTISEMENTS_PATH).authenticated()
                                .requestMatchers(HttpMethod.DELETE, API_ADVERTISEMENTS_PATH).authenticated()

                                .requestMatchers("/logout").authenticated()
                                .requestMatchers("/account").authenticated()
                                .requestMatchers("/messages").authenticated()
                                .requestMatchers("/favourites").authenticated()
                                .requestMatchers("/advertisements").authenticated()
                                .requestMatchers("/api/messages/**").authenticated()
                                .requestMatchers("/api/user/details").authenticated()
                                .requestMatchers("/advertisement/new").authenticated()
                                .requestMatchers("/advertisement/edit").authenticated()
                                .requestMatchers("/api/conversations/**").authenticated()
                                .requestMatchers("/api/users/favourites/**").authenticated()
                                .requestMatchers("/actuator/prometheus").hasAnyRole(ROLE_ADMIN, ROLE_MONITORING)

                                .requestMatchers("/swagger-ui/**").hasRole(ROLE_ADMIN)
                                .requestMatchers("/management").hasRole(ROLE_ADMIN)
                                .anyRequest().hasRole(ROLE_ADMIN)

                )
                .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
                .authenticationProvider(authenticationProvider())
                .logout(logout ->
                        logout
                                .logoutUrl("/logout")
                                .addLogoutHandler(logoutHandler)
                                .logoutSuccessHandler(successLogoutHandler())
                )
                .exceptionHandling(exception ->
                        exception
                                .authenticationEntryPoint(new CustomAuthenticationEntryPoint())
                                .accessDeniedPage("/"));
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("*");
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
}