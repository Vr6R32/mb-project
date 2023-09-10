package pl.motobudzet.api.fileManager.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.motobudzet.api.fileManager.service.PublicAdvertisementImageService;

import java.util.List;

@RestController
@RequestMapping(value = "api/advertisements/")
public class PublicAdvertisementImageController {


    private final PublicAdvertisementImageService publicAdvertisementImageService;

    public PublicAdvertisementImageController(PublicAdvertisementImageService publicAdvertisementImageService) {
        this.publicAdvertisementImageService = publicAdvertisementImageService;
    }

//    @PostMapping(value = "image/{advertisementId}",consumes = "multipart/form-data")
//    public ResponseEntity<String> uploadPublicAdvertisementImage(@PathVariable String advertisementId ,
//                                                                @RequestParam MultipartFile files) {
//        return publicAdvertisementImageService.uploadPublicAdvertisementImage(advertisementId,files);
//    }

    @PostMapping(value = "images/{advertisementId}", consumes = "multipart/form-data")
    public ResponseEntity<String> uploadPublicAdvertisementImages(@PathVariable String advertisementId,
                                                                  @RequestParam(required = false) String mainPhotoUrl,
                                                                  @RequestParam List<MultipartFile> files) {
        return publicAdvertisementImageService.uploadAndProcessImagesWithLogo(advertisementId, mainPhotoUrl, files);
    }


}