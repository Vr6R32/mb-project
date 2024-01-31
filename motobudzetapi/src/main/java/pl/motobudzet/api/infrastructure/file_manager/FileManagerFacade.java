package pl.motobudzet.api.infrastructure.file_manager;

import lombok.AllArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@AllArgsConstructor
public class FileManagerFacade {

    private final FileService fileService;

    public Resource getAdvertisementPhoto(String imageUrl) {
        return fileService.getAdvertisementPhoto(imageUrl);
    }

    public String verifySortAndSaveImages(UUID advertisementId, List<MultipartFile> files) {
        return fileService.verifySortAndSaveImages(advertisementId, files);
    }

    public int insertNewPhotos(UUID id, Set<String> names) {
        return fileService.insertNewPhotos(id, names);
    }
}
