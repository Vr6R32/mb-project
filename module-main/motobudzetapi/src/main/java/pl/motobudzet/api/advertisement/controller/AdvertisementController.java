package pl.motobudzet.api.advertisement.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.motobudzet.api.advertisement.dto.AdvertisementDTO;
import pl.motobudzet.api.advertisement.dto.AdvertisementRequest;
import pl.motobudzet.api.advertisement.service.AdvertisementService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "api/advertisements")
public class AdvertisementController {

    private final AdvertisementService advertisementService;

    public AdvertisementController(AdvertisementService advertisementService) {
        this.advertisementService = advertisementService;
    }

    @PostMapping
    public ResponseEntity<String> createNewAdvertisement(@ModelAttribute @Valid AdvertisementRequest request,
                                                         @RequestParam List<MultipartFile> files,
                                                         Authentication authentication) {
        return advertisementService.createNewAdvertisement(request, authentication.getName(), files);
    }

    @GetMapping(value = "all")
    public List<AdvertisementDTO> getAllUserAdvertisements(Authentication authentication) {
        return advertisementService.getAllUserAdvertisements(authentication.getName());
    }

    @GetMapping("/{id}")
    public AdvertisementDTO findOneByIdWithFetch(@PathVariable UUID id) {
        return advertisementService.findOneByIdWithFetch(id);
    }

    @DeleteMapping("/{id}")
    public int deleteAdvertisement(@PathVariable UUID id, Authentication authentication) {
        return advertisementService.deleteUserAdvertisement(id, authentication.getName());
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<String> editExistingAdvertisement(@PathVariable UUID id,
                                                            @ModelAttribute @Valid AdvertisementRequest request,
                                                            @RequestParam List<MultipartFile> files,
                                                            Authentication authentication) {
        return advertisementService.editExistingAdvertisement(id, request, authentication.getName(), files);
    }

    @GetMapping("/last-uploaded")
    public List<AdvertisementDTO> findLastUploaded(@RequestParam(required = false) Integer pageNumber,
                                                   @RequestParam(required = false, defaultValue = "12") Integer pageSize) {
        return advertisementService.findLastUploaded(pageNumber, pageSize);
    }


    @GetMapping("all-to-verify")
    public List<AdvertisementDTO> findAllAdvertisementsToVerify(@RequestParam(required = false) Integer pageNumber) {
        return advertisementService.findAllAdvertisementsToVerify(pageNumber);
    }

    @PostMapping("verify/{id}")
    public String verifyAndEnableAdvertisement(@PathVariable UUID id) {
        return advertisementService.verifyAndEnableAdvertisement(id);
    }

}
