package pl.motobudzet.api.file_manager;

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

    @Value("${email-service.email-address}")
    private String infoEmailAddressPath;
    @Value("${email-service.url}")
    private String siteUrlPath;

}