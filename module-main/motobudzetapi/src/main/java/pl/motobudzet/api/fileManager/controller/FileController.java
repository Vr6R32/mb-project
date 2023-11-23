package pl.motobudzet.api.fileManager.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.motobudzet.api.fileManager.service.FileService;

import java.util.List;

@RestController
@RequestMapping(value = "api/advertisements/")
public class FileController {
    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping(value = "images/{advertisementId}", consumes = "multipart/form-data")
    public ResponseEntity<String> uploadAdvertisementImages(@PathVariable String advertisementId,
                                                            @RequestParam(required = false) String mainPhotoUrl,
                                                            @RequestParam List<MultipartFile> files) {
        return fileService.verifyAndSortImages(advertisementId, mainPhotoUrl, files);
    }


}