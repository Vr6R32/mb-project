package pl.motobudzet.api.z_configuration.securty_jwt;

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
import pl.motobudzet.api.z_playground.session.SessionListener;

import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;


@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final LogoutHandler logoutHandler;
    private final UserDetailsServiceImpl userDetailsService;


    @Bean
    public SessionListener httpSessionListener() {
        return new SessionListener();
    }

    @Bean
    public static PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SimpleUrlLogoutSuccessHandler successLogoutHandler() {
        SimpleUrlLogoutSuccessHandler logoutSuccessHandler = new SimpleUrlLogoutSuccessHandler();
        logoutSuccessHandler.setDefaultTargetUrl("/login?logout=true");
        return logoutSuccessHandler;
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
            "/actuator/**",
            "/api/session/**",
            "/reset",
            "/apple-touch-icon-precomposed.png",
            "/login",
            "/register",
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
                                .requestMatchers("/user/details/**").hasRole("AWAITING_DETAILS")
                                .requestMatchers("/api/user/updateDetails/**").hasRole("AWAITING_DETAILS")

                                .requestMatchers(HttpMethod.GET, "/api/advertisements/**").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/advertisements/**").authenticated()
                                .requestMatchers(HttpMethod.PUT, "/api/advertisements/**").authenticated()
                                .requestMatchers(HttpMethod.DELETE, "/api/advertisements/**").authenticated()

                                .requestMatchers("/logout").authenticated()
                                .requestMatchers("/account").authenticated()
                                .requestMatchers("/messages").authenticated()
                                .requestMatchers("/favourites").authenticated()
                                .requestMatchers("/advertisement/new").authenticated()
                                .requestMatchers("/advertisements").authenticated()
                                .requestMatchers("/api/messages/**").authenticated()
                                .requestMatchers("/api/user/details").authenticated()
                                .requestMatchers("/advertisement/edit").authenticated()
                                .requestMatchers("/api/conversations/**").authenticated()
                                .requestMatchers("/api/users/favourites/**").authenticated()

                                .requestMatchers("/swagger-ui/**").hasRole("ADMIN")
                                .requestMatchers("/management").hasRole("ADMIN")
                                .anyRequest().hasRole("ADMIN")

                )
                .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
                .authenticationProvider(authenticationProvider())
                .logout(logout ->
                        logout
                                .logoutUrl("/logout")
                                .addLogoutHandler(logoutHandler)
                                .logoutSuccessHandler(successLogoutHandler())
                )
                .exceptionHandling((exception) ->
                        exception
                                .authenticationEntryPoint(new CustomAuthenticationEntryPoint())
                                .accessDeniedPage("/"));
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("*"); // Odblokuj dostęp ze wszystkich domen (uwaga na bezpieczeństwo w środowisku produkcyjnym)
        configuration.addAllowedMethod("*"); // Odblokuj wszystkie metody HTTP
        configuration.addAllowedHeader("*"); // Odblokuj wszystkie nagłówki

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

//    @Bean
//    public JwtAuthenticationConverter jwtAuthenticationConverter() {
//        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
//
//        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
//        grantedAuthoritiesConverter.setAuthorityPrefix("");
//        grantedAuthoritiesConverter.setAuthoritiesClaimName("roles");
//        converter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
//
//
////        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
////            List<String> roles = (List<String>) jwt.getClaims().get("roles");
////            return roles.stream()
////                    .map(SimpleGrantedAuthority::new)
////                    .collect(Collectors.toList());
////        });
//
//
//        return converter;
//    }
}