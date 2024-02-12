package pl.motobudzet.api.adapter.rest;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.motobudzet.api.adapter.facade.AdvertisementFacade;
import pl.motobudzet.api.dto.AdvertisementDTO;
import pl.motobudzet.api.dto.AdvertisementRequest;
import pl.motobudzet.api.domain.user.entity.AppUser;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "api/advertisements")
@AllArgsConstructor
class AdvertisementController {

    private final AdvertisementFacade advertisementFacade;

    @PostMapping
    public ResponseEntity<String> createNewAdvertisement(@ModelAttribute @Valid AdvertisementRequest request,
                                                         @RequestParam List<MultipartFile> files,
                                                         Authentication authentication) {
        AppUser loggedUser = (AppUser) authentication.getPrincipal();
        return advertisementFacade.createAdvertisement(request, loggedUser, files);
    }

    @GetMapping(value = "all")
    public List<AdvertisementDTO> getAllUserAdvertisements(Authentication authentication) {
        AppUser loggedUser = (AppUser) authentication.getPrincipal();
        return advertisementFacade.getUserAdvertisements(loggedUser);
    }

    @GetMapping("/{id}")
    public AdvertisementDTO findOneByIdWithFetch(@PathVariable UUID id) {
        return advertisementFacade.getAdvertisementById(id);
    }

    @DeleteMapping("/{id}")
    public int deleteAdvertisement(@PathVariable UUID id, Authentication authentication) {
        AppUser loggedUser = (AppUser) authentication.getPrincipal();
        return advertisementFacade.deleteAdvertisement(id,loggedUser);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<String> editAdvertisement(@PathVariable UUID id,
                                                            @ModelAttribute @Valid AdvertisementRequest request,
                                                            @RequestParam List<MultipartFile> files,
                                                            Authentication authentication) {
        AppUser loggedUser = (AppUser) authentication.getPrincipal();
        return advertisementFacade.editAdvertisement(id, request, loggedUser, files);
    }

    @GetMapping("/last-uploaded")
    public List<AdvertisementDTO> getFewLastUploadedAdvertisements(@RequestParam(required = false) Integer pageNumber,
                                                   @RequestParam(required = false, defaultValue = "12") Integer pageSize) {
        return advertisementFacade.getFewLastUploadedAdvertisements(pageNumber, pageSize);
    }


    @GetMapping("all-to-verify")
    public List<AdvertisementDTO> findAllAdvertisementsToVerify(@RequestParam(required = false) Integer pageNumber) {
        return advertisementFacade.getAdvertisementsToVerify(pageNumber);
    }

    @PostMapping("verify/{id}")
    public String verifyAndEnableAdvertisement(@PathVariable UUID id,Authentication authentication) {
        AppUser loggedUser = (AppUser) authentication.getPrincipal();
        return advertisementFacade.verifyAdvertisement(id,loggedUser);
    }

    @PostMapping("reject/{id}")
    public int rejectAdvertisement(@PathVariable UUID id,Authentication authentication) {
        AppUser loggedUser = (AppUser) authentication.getPrincipal();
        return advertisementFacade.rejectAdvertisement(id,loggedUser);
    }

}
