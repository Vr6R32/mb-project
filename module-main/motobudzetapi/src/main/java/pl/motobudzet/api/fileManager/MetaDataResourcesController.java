package pl.motobudzet.api.fileManager;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import static pl.motobudzet.api.fileManager.FileService.PRIVATE_FILE_PATH;

@RestController
public class MetaDataResourcesController {

    @GetMapping(value = "apple-touch-icon-precomposed.png", produces = "image/x-icon")
    public Resource getFaviconForApple() {
        return new FileSystemResource(PRIVATE_FILE_PATH + "favicon.ico");
    }
    @GetMapping(value = "favicon.ico", produces = "image/x-icon")
    public Resource getFaviconForRobots() {
        return new FileSystemResource(PRIVATE_FILE_PATH + "favicon.ico");
    }
}
