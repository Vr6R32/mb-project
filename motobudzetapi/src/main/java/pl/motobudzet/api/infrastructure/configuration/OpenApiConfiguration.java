package pl.motobudzet.api.infrastructure.configuration;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@SecurityScheme(
        name = "accessTokenCookie",
        type = SecuritySchemeType.APIKEY,
        in = SecuritySchemeIn.COOKIE,
        paramName = "accessToken"
)
@SecurityScheme(
        name = "JWT Bearer Token",
        description = "JWT token authorization",
        scheme = "bearer",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        in = SecuritySchemeIn.HEADER
)

@Configuration
public class OpenApiConfiguration {

    public static final String MOTOBUDZET_URL = "https://motobudzet.pl/";
    @Value("${spring.application.name}")
    private String appName;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info().title(appName)
                        .description("OpenApi documentation for " + appName)
                        .version("1.0")
                        .contact(new Contact()
                                .name("Michal Kowalkowski")
                                .email("kowalkowski.michal24@gmail.com")
                                .url(MOTOBUDZET_URL))
                        .license(new License()
                                .name("Moto-Budżet")
                                .url(MOTOBUDZET_URL)))
                .addServersItem(new Server().url("https://localhost:443").description("LOCAL ENV"))
                .addServersItem(new Server().url(MOTOBUDZET_URL).description("PROD ENV"))
                .addSecurityItem(new SecurityRequirement().addList("HTTP only cookie"))
                .addSecurityItem(new SecurityRequirement().addList("JWT Bearer Token"));
    }
}
