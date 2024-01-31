package pl.motobudzet.api.infrastructure.file_manager;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
public class MetaDataResourcesController {

    private final PathsConfig pathsConfig;

    public MetaDataResourcesController(PathsConfig pathsConfig) {
        this.pathsConfig = pathsConfig;
    }

    @GetMapping(value = "apple-touch-icon-precomposed.png", produces = "image/x-icon")
    public Resource getFaviconForApple() {
        return new FileSystemResource(pathsConfig.getPrivateFilePath() + "favicon.ico");
    }
    @GetMapping(value = "favicon.ico", produces = "image/x-icon")
    public Resource getFaviconForRobots() {
        return new FileSystemResource(pathsConfig.getPrivateFilePath() + "favicon.ico");
    }
}
