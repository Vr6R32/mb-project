package pl.motobudzet.api.adapter.facade;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;
import pl.motobudzet.api.infrastructure.file_manager.FileService;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
public class FileManagerFacade {

    private final FileService fileService;

    public Resource getAdvertisementPhoto(String imageUrl) {
        return fileService.getAdvertisementPhoto(imageUrl);
    }

    @Transactional
    public String verifySortAndSaveImages(UUID advertisementId, List<MultipartFile> files) {
        return fileService.verifySortAndSaveImages(advertisementId, files);
    }
}
