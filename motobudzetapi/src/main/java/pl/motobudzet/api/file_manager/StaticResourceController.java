package pl.motobudzet.api.file_manager;


import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RequestMapping("api/static")
@RestController
public class StaticResourceController {

    private final FileService fileService;
    private final PathsConfig pathsConfig;

    public StaticResourceController(FileService fileService, PathsConfig pathsConfig) {
        this.fileService = fileService;
        this.pathsConfig = pathsConfig;
    }



    @GetMapping(value = "/photo/{imageUrl}", produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<Resource> getAdvertisementPhoto(@PathVariable String imageUrl) {

        Resource photoResource = fileService.getAdvertisementPhoto(imageUrl);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(photoResource);
    }

    @GetMapping(value = "favicon", produces = "image/x-icon")
    public Resource getFavicon() {
        return new FileSystemResource(pathsConfig.getPrivateFilePath() + "favicon.ico");
    }


    @GetMapping(value = "/background_email", produces = MediaType.IMAGE_JPEG_VALUE)
    public Resource getEmailBackgroundImage() {
        return new FileSystemResource(pathsConfig.getPrivateFilePath() + "emailBackground.jpg");
    }
    @GetMapping(value = "/validationFail", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getValidationFailGif() {
        return new FileSystemResource(pathsConfig.getPrivateFilePath() + "validationFail.webp");
    }

    @GetMapping(value = "/loading", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getLoadingGif() {
        return new FileSystemResource(pathsConfig.getPrivateFilePath() + "loadingCircle.webp");
    }

    @GetMapping(value = "/engineType/{engineType}", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getEngineType(@PathVariable String engineType) {
        return new FileSystemResource(pathsConfig.getPrivateFilePath() + engineType.toLowerCase() + ".png");
    }

    @GetMapping(value = "/transmissionType/{transmissionType}", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getTransmissionType(@PathVariable String transmissionType) {
        return new FileSystemResource(pathsConfig.getPrivateFilePath() + transmissionType.toLowerCase() + ".png");
    }

    @GetMapping(value = "/engineHorsePower", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getEngineHorsePower() {
        return new FileSystemResource(pathsConfig.getPrivateFilePath() + "engineHorsePower.png");
    }

    @GetMapping(value = "/engineCapacity", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getEngineCapacity() {
        return new FileSystemResource(pathsConfig.getPrivateFilePath() + "engineCapacity.png");
    }

    @GetMapping(value = "/fuelType", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getFuel() {
        return new FileSystemResource(pathsConfig.getPrivateFilePath() + "fuel.png");
    }

    @GetMapping(value = "/price", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getPrice() {
        return new FileSystemResource(pathsConfig.getPrivateFilePath() + "price.png");
    }

    @GetMapping(value = "/mileage", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getMileage() {
        return new FileSystemResource(pathsConfig.getPrivateFilePath() + "mileage.png");
    }

    @GetMapping(value = "/productionDate", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getProduction() {
        return new FileSystemResource(pathsConfig.getPrivateFilePath() + "production.png");
    }

    @GetMapping(value = "/construction", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getConstructionSite() {
        return new FileSystemResource(pathsConfig.getPrivateFilePath() + "construction.png");
    }

    @GetMapping(value = "/logo", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getLogo() {
        return new FileSystemResource(pathsConfig.getPrivateFilePath() + "logo.png");
    }

    @GetMapping(value = "logo/facebookLogo", produces = MediaType.IMAGE_JPEG_VALUE)
    public Resource getLogoEnlarged() {
        return new FileSystemResource(pathsConfig.getPrivateFilePath() + "lamboFacebook.jpg");
    }

    @GetMapping(value = "/heartEmpty", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getHeartEmpty() {
        return new FileSystemResource(pathsConfig.getPrivateFilePath() + "heartEmpty.png");
    }

    @GetMapping(value = "/heartFull", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getHeartFull() {
        return new FileSystemResource(pathsConfig.getPrivateFilePath() + "heartFull.png");
    }

    @GetMapping(value = "/messageClosed", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getMessageClosed() {
        return new FileSystemResource(pathsConfig.getPrivateFilePath() + "messageClosed.png");
    }

    @GetMapping(value = "/messageOpen", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getMessageOpen() {
        return new FileSystemResource(pathsConfig.getPrivateFilePath() + "messageOpen.png");
    }

    @GetMapping(value = "/editIcon", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getEditIcon() {
        return new FileSystemResource(pathsConfig.getPrivateFilePath() + "editIcon.png");
    }

    @GetMapping(value = "/trashOpen", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getTrashIconOpen() {
        return new FileSystemResource(pathsConfig.getPrivateFilePath() + "trashOpen.png");
    }

    @GetMapping(value = "/trashClosed", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getTrashIconClosed() {
        return new FileSystemResource(pathsConfig.getPrivateFilePath() + "trashClosed.png");
    }

    @GetMapping(value = "/successIcon", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getSuccessIcon() {
        return new FileSystemResource(pathsConfig.getPrivateFilePath() + "successIcon.png");
    }

    @GetMapping(value = "/rejectIcon", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getRejectIcon() {
        return new FileSystemResource(pathsConfig.getPrivateFilePath() + "rejectIcon.png");
    }

    @GetMapping(value = "/deleteIcon", produces = MediaType.IMAGE_PNG_VALUE)
    public Resource getDeleteIcon() {
        return new FileSystemResource(pathsConfig.getPrivateFilePath() + "deleteIcon.png");
    }

}
