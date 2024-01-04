package pl.motobudzet.api.advertisement.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.motobudzet.api.advertisement.dto.AdvertisementRequest;
import pl.motobudzet.api.advertisement.dto.AdvertisementDTO;
import pl.motobudzet.api.advertisement.service.UserAdvertisementService;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "api/advertisements")
public class UserAdvertisementController {

    private final UserAdvertisementService userAdvertisementService;

    public UserAdvertisementController(UserAdvertisementService userAdvertisementService) {
        this.userAdvertisementService = userAdvertisementService;
    }

    @GetMapping("/last-uploaded")
    public List<AdvertisementDTO> findLastUploaded(@RequestParam(required = false) Integer pageNumber,
                                                   @RequestParam(required = false, defaultValue = "12") Integer pageSize) {
        return userAdvertisementService.findLastUploaded(pageNumber, pageSize);
    }

    @GetMapping("/{id}")
    public AdvertisementDTO findOneByIdWithFetch(@PathVariable UUID id) {
        return userAdvertisementService.findOneByIdWithFetch(id);
    }
    @DeleteMapping("/{id}")
    public int deleteAdvertisement(@PathVariable UUID id, Authentication authentication) {
        return userAdvertisementService.deleteUserAdvertisement(id,authentication.getName());
    }

    @PostMapping
    public ResponseEntity<String> createNewAdvertisement(@ModelAttribute @Valid AdvertisementRequest request,
                                                         @RequestParam List<MultipartFile> files,
                                                         Authentication authentication) {
        return userAdvertisementService.createNewAdvertisement(request, authentication.getName(),files);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<String> editExistingAdvertisement(@PathVariable UUID id,
                                                            @ModelAttribute @Valid AdvertisementRequest request,
                                                            @RequestParam List<MultipartFile> files,
                                                            Authentication authentication) {
        return userAdvertisementService.editExistingAdvertisement(id, request, authentication.getName(),files);
    }

    @GetMapping(value = "user/{username}")
    public List<AdvertisementDTO> getAllUserAdvertisements(@PathVariable String username,
                                                           Principal principal) {
        return userAdvertisementService.getAllUserAdvertisements(username, principal.getName());
    }

    @PostMapping(value = "favourites")
    public List<AdvertisementDTO> getAllUserFavouritesAdvertisements(@RequestBody List<String> uuidStringList) {
        return userAdvertisementService.getAllUserFavouritesAdvertisements(uuidStringList);
    }
}
