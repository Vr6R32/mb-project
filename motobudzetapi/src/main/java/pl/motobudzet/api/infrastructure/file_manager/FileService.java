package pl.motobudzet.api.infrastructure.file_manager;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface FileService {

    Resource getAdvertisementPhoto(String imageUrl);

    String verifySortAndSaveImages(UUID advertisementId, List<MultipartFile> files);
}
