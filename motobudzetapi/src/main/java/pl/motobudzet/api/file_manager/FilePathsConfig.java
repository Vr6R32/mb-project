package pl.motobudzet.api.file_manager;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Data
@Component
public class FilePathsConfig {

    @Value("${paths.public}")
    private String publicFilePath;
    @Value("${paths.private}")
    private String privateFilePath;

}