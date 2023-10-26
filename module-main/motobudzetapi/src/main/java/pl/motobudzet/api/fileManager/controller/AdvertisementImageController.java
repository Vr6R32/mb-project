package pl.motobudzet.api.fileManager.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.motobudzet.api.fileManager.service.AdvertisementImageService;

import java.util.List;

@RestController
@RequestMapping(value = "api/advertisements/")
public class AdvertisementImageController {


    private final AdvertisementImageService advertisementImageService;

    public AdvertisementImageController(AdvertisementImageService advertisementImageService) {
        this.advertisementImageService = advertisementImageService;
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
        return advertisementImageService.uploadAndProcessImagesWithLogo(advertisementId, mainPhotoUrl, files);
    }


}