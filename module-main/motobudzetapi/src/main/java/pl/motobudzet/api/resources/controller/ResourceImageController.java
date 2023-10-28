package pl.motobudzet.api.resources.controller;


import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.motobudzet.api.resources.service.ResourceImageService;

import static pl.motobudzet.api.fileManager.service.AdvertisementImageService.PRIVATE_FILE_PATH;

@RequestMapping("api/resources")
@RestController
public class ResourceImageController {

    private final ResourceImageService resourceImageService;

    public ResourceImageController(ResourceImageService resourceImageService) {
        this.resourceImageService = resourceImageService;
    }

    @GetMapping(value = "/engineType/{engineType}", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getEngineType(@PathVariable String engineType) {
        return new FileSystemResource(PRIVATE_FILE_PATH + engineType.toLowerCase() + ".png");
    }

    @GetMapping(value = "/transmissionType/{transmissionType}", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getTransmissionType(@PathVariable String transmissionType) {
        return new FileSystemResource(PRIVATE_FILE_PATH + transmissionType.toLowerCase() + ".png");
    }

    @GetMapping(value = "/engineHorsePower", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getEngineHorsePower() {
        return new FileSystemResource(PRIVATE_FILE_PATH + "engineHorsePower.png");
    }
    @GetMapping(value = "/engineCapacity", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getEngineCapacity() {
        return new FileSystemResource(PRIVATE_FILE_PATH + "engineCapacity.png");
    }

    @GetMapping(value = "/fuelType", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getFuel() {
        return new FileSystemResource(PRIVATE_FILE_PATH + "fuel.png");
    }

    @GetMapping(value = "/price", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getPrice() {
        return new FileSystemResource(PRIVATE_FILE_PATH + "price.png");
    }

    @GetMapping(value = "/mileage", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getMileage() {
        return new FileSystemResource(PRIVATE_FILE_PATH + "mileage.png");
    }

    @GetMapping(value = "/productionDate", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getProduction() {
        return new FileSystemResource(PRIVATE_FILE_PATH + "production.png");
    }

    @GetMapping(value = "/construction", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getConstructionSite() {
        return new FileSystemResource(PRIVATE_FILE_PATH + "construction.png");
    }

    @GetMapping(value = "/logo", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getLogo() {
        return new FileSystemResource(PRIVATE_FILE_PATH + "logo.png");
    }

    @GetMapping(value = "/heartEmpty", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getHeartEmpty() {
        return new FileSystemResource(PRIVATE_FILE_PATH + "heartEmpty.png");
    }

    @GetMapping(value = "/heartFull", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getHeartFull() {
        return new FileSystemResource(PRIVATE_FILE_PATH + "heartFull.png");
    }

    @GetMapping(value = "/messageClosed", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getMessageClosed() {
        return new FileSystemResource(PRIVATE_FILE_PATH + "messageClosed.png");
    }

    @GetMapping(value = "/messageOpen", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getMessageOpen() {
        return new FileSystemResource(PRIVATE_FILE_PATH + "messageOpen.png");
    }

    @GetMapping(value = "/editIcon", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getEditIcon() {
        return new FileSystemResource(PRIVATE_FILE_PATH + "editIcon.png");
    }

    @GetMapping(value = "/trashOpen", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getTrashIconOpen() {
        return new FileSystemResource(PRIVATE_FILE_PATH + "trashOpen.png");
    }
    @GetMapping(value = "/trashClosed", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getTrashIconClosed() {
        return new FileSystemResource(PRIVATE_FILE_PATH + "trashClosed.png");
    }

    @GetMapping(value = "/successIcon", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getSuccessIcon() {
        return new FileSystemResource(PRIVATE_FILE_PATH + "successIcon.png");
    }

    @GetMapping(value = "/deleteIcon", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getDeleteIcon() {
        return new FileSystemResource(PRIVATE_FILE_PATH + "deleteIcon.png");
    }



    @GetMapping(value = "/advertisementPhoto/{imageUrl}", produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<Resource> getAdvertisementPhoto(@PathVariable String imageUrl) {

        Resource photoResource = resourceImageService.getAdvertisementPhoto(imageUrl);

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(photoResource);
    }
}
