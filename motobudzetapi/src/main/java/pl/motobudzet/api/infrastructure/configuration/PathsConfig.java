package pl.motobudzet.api.infrastructure.configuration;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Data
@Component
public class PathsConfig {

    @Value("${paths.public}")
    private String publicFilePath;
    @Value("${paths.private}")
    private String privateFilePath;

}