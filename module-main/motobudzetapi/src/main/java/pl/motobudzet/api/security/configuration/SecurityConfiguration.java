package pl.motobudzet.api.security.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
import pl.motobudzet.api.security.filter.AddressLoggingFilter;
import pl.motobudzet.api.security.service.UserDetailsServiceImpl;

import java.util.concurrent.TimeUnit;


@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    private final UserDetailsServiceImpl userDetailsService;


    public SecurityConfiguration(UserDetailsServiceImpl userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public static PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    @SuppressWarnings("deprecation")
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .cors().and()
                .addFilterBefore(new AddressLoggingFilter(), SecurityContextPersistenceFilter.class)
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers("/", "index", "/css/*", "/js/*").permitAll()
                                .requestMatchers("/id/**").permitAll()
                                .requestMatchers("/register").permitAll()
                                .requestMatchers("/favicon.ico").permitAll()
                                .requestMatchers("/api/spec/**").permitAll()
                                .requestMatchers("/api/models/**").permitAll()
                                .requestMatchers("/api/brands/**").permitAll()
                                .requestMatchers("/api/resources/**").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/user").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/advertisements/**").permitAll()

                                .requestMatchers(HttpMethod.POST, "/api/advertisements/**").authenticated()
                                .requestMatchers(HttpMethod.PUT, "/api/advertisements/**").authenticated()
                                .requestMatchers("/account").authenticated()
                                .requestMatchers("/messages").authenticated()
                                .requestMatchers("/favourites").authenticated()
                                .requestMatchers("/api/messages/**").authenticated()
                                .requestMatchers("/api/conversations/**").authenticated()
                                .requestMatchers("/advertisement/new").authenticated()

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