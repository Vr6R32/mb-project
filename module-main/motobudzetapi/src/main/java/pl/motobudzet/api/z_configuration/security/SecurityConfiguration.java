package pl.motobudzet.api.z_configuration.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.SecurityContextPersistenceFilter;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import pl.motobudzet.api.z_playground.session.SessionListener;

import java.util.concurrent.TimeUnit;


@Configuration
@EnableWebSecurity
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class SecurityConfiguration {

    private final UserDetailsServiceImpl userDetailsService;


    public SecurityConfiguration(UserDetailsServiceImpl userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SessionListener httpSessionListener(){
        return new SessionListener();
    }
    @Bean
    public static PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    @SuppressWarnings("deprecation")
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.disable())
                .addFilterBefore(new AddressLoggingFilter(), SecurityContextPersistenceFilter.class)
                .addFilterBefore(new UserAwaitingDetailsFilter(), SecurityContextPersistenceFilter.class)
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers("/", "index", "/css/*", "/js/*").permitAll()
                                .requestMatchers("/advertisement").permitAll()
                                .requestMatchers("/reset").permitAll()
                                .requestMatchers("/register").permitAll()
                                .requestMatchers("/actuator/**").permitAll()
                                .requestMatchers("/favicon.ico").permitAll()
                                .requestMatchers("/api/spec/**").permitAll()
                                .requestMatchers("/api/models/**").permitAll()
                                .requestMatchers("/api/cities/**").permitAll()
                                .requestMatchers("/api/brands/**").permitAll()
                                .requestMatchers("/api/user/forgot").permitAll()
                                .requestMatchers("/api/static/**").permitAll()
                                .requestMatchers("/api/v1/clone/**").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/user/confirm").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/user/register").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/user/resetCode").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/advertisements/**").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/user/resetPassword").permitAll()

                                .requestMatchers("/user/details/**").hasAuthority("ROLE_AWAITING_DETAILS")
                                .requestMatchers("/api/user/updateDetails/**").hasAnyAuthority("ROLE_AWAITING_DETAILS","ROLE_USER")

                                .requestMatchers(HttpMethod.POST, "/api/advertisements/**").authenticated()
                                .requestMatchers(HttpMethod.PUT, "/api/advertisements/**").authenticated()
                                .requestMatchers(HttpMethod.DELETE, "/api/advertisements/**").authenticated()
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



                                .requestMatchers("/swagger-ui/**").hasRole("ADMIN")

                                .anyRequest().hasRole("ADMIN")

                )
                .formLogin((formLogin) ->
                        formLogin
                                .loginPage("/login")
                                .permitAll()
                                .defaultSuccessUrl("/", true)
                                .passwordParameter("password")
                                .usernameParameter("username")
                                .successHandler((request, response, authentication) -> {
                                    SavedRequest savedRequest = new HttpSessionRequestCache().getRequest(request, response);
                                    if (savedRequest != null) {
                                        new DefaultRedirectStrategy().sendRedirect(request, response, savedRequest.getRedirectUrl());
                                    } else {
                                        new DefaultRedirectStrategy().sendRedirect(request, response, "/");
                                    }
                                })
                )
                .rememberMe(rememberMe ->
                        rememberMe
                                .tokenValiditySeconds((int) TimeUnit.DAYS.toSeconds(21))
                                .key("K1ENKLkU5P")
                                .rememberMeParameter("remember-me")
                )
                .logout(logout ->
                        logout
                                .logoutUrl("/logout")
                                .logoutRequestMatcher(new AntPathRequestMatcher("/logout", "GET"))
                                .clearAuthentication(true)
                                .invalidateHttpSession(true)
                                .deleteCookies("JSESSIONID", "remember-me", "lastButton")
                                .logoutSuccessUrl("/")
                );

        return http.build();
    }


    @Autowired
    public void authenticationConfig(AuthenticationManagerBuilder authentication) throws Exception {
        authentication
                .userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder());
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
}