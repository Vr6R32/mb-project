package pl.motobudzet.api.advertisement.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pl.motobudzet.api.advertisement.dto.AdvertisementCreateRequest;
import pl.motobudzet.api.advertisement.dto.AdvertisementDTO;
import pl.motobudzet.api.advertisement.service.UserAdvertisementService;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

import static pl.motobudzet.api.security.SessionListener.getActiveSessions;

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
        System.out.println(getActiveSessions());
        return userAdvertisementService.findLastUploaded(pageNumber, pageSize);
    }

    @GetMapping("/{id}")
    public AdvertisementDTO findOneByIdWithFetch(@PathVariable UUID id) {
        return userAdvertisementService.findOneByIdWithFetch(id);
    }
    @DeleteMapping("/{id}")
    public int deleteUserAdvertisement(@PathVariable UUID id,Authentication authentication) {
        return userAdvertisementService.deleteUserAdvertisement(id,authentication.getName());
    }

    @PostMapping(consumes = "application/json")
    public ResponseEntity<String> createNewAdvertisement(@RequestBody @Valid AdvertisementCreateRequest request,
                                                         Authentication authentication) {
        return userAdvertisementService.createNewAdvertisement(request, authentication.getName());
    }

    @PutMapping(value = "/{id}", consumes = "application/json")
    public ResponseEntity<String> editExistingAdvertisement(@PathVariable String id,
                                                            @RequestBody @Valid AdvertisementCreateRequest request,
                                                            Authentication authentication) {
        return userAdvertisementService.editExistingAdvertisement(id, request, authentication.getName());
    }

    @GetMapping(value = "user/{username}")
    public List<AdvertisementDTO> getAllUserAdvertisements(@PathVariable String username,
                                                           Principal principal) {
        return userAdvertisementService.getAllUserAdvertisements(username, principal.getName());
    }

    @PostMapping(value = "favourites/{username}")
    public List<AdvertisementDTO> getAllUserFavouritesAdvertisements(@PathVariable String username,
                                                                     Principal principal,
                                                                     @RequestBody List<String> uuidStringList) {
        return userAdvertisementService.getAllUserFavouritesAdvertisements(username, principal.getName(), uuidStringList);
    }
}
