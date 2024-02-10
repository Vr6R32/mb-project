package pl.motobudzet.mailingmodule;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Data
@Component
public class PathsConfig {

    @Value("${email-service.email-address}")
    private String infoEmailAddressPath;
    @Value("${email-service.url}")
    private String siteUrlPath;

}