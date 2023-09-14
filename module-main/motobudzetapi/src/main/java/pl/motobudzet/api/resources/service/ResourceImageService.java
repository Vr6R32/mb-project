package pl.motobudzet.api.resources.service;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.File;

import static pl.motobudzet.api.fileManager.service.PublicAdvertisementImageService.PUBLIC_FILE_PATH;

@Service
public class ResourceImageService {

    public Resource getAdvertisementPhoto(String imageUrl) {
        File file = new File(PUBLIC_FILE_PATH + imageUrl);
        return new FileSystemResource(file);
    }
}
