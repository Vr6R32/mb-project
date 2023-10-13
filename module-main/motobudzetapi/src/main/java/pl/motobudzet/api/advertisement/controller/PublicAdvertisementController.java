package pl.motobudzet.api.advertisement.controller;


import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.motobudzet.api.advertisement.dto.AdvertisementCreateRequest;
import pl.motobudzet.api.advertisement.dto.AdvertisementDTO;
import pl.motobudzet.api.advertisement.service.PublicAdvertisementService;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "api/advertisements")
public class PublicAdvertisementController {

    private final PublicAdvertisementService publicAdvertisementService;

    public PublicAdvertisementController(PublicAdvertisementService publicAdvertisementService) {
        this.publicAdvertisementService = publicAdvertisementService;
    }

    @GetMapping("/last-uploaded")
    public Page<AdvertisementDTO> findLastUploaded(@RequestParam(required = false) Integer pageNumber, @RequestParam(required = false, defaultValue = "12") Integer pageSize) {
        return publicAdvertisementService.findLastUploaded(pageNumber, pageSize);
    }

    @GetMapping("/{id}")
    public AdvertisementDTO findOneByIdWithFetch(@PathVariable UUID id) {
        return publicAdvertisementService.findOneByIdWithFetch(id);
    }

    @PostMapping(consumes = "application/json")
    public ResponseEntity<String> createNewAdvertisement(@RequestBody @Valid AdvertisementCreateRequest request, HttpServletRequest httpServletRequest) {
        String user = httpServletRequest.getUserPrincipal().getName();
        return publicAdvertisementService.createNewAdvertisement(request,user);
    }

    @PutMapping(value = "/{id}", consumes = "application/json")
    public String editExistingAdvertisement(@PathVariable String id,
                                            @RequestBody @Valid AdvertisementCreateRequest request) {
        return publicAdvertisementService.editExistingAdvertisement(id, request);
    }
    @GetMapping(value = "user/{username}")
    public List<AdvertisementDTO> getAllUserAdvertisements(@PathVariable String username, Principal principal){
        return publicAdvertisementService.getAllUserAdvertisements(username,principal.getName());
    }
//    @JsonFormat(with = JsonFormat.Feature.ACCEPT_SINGLE_VALUE_AS_ARRAY)
    @PostMapping(value = "favourites/{username}")
    public List<AdvertisementDTO> getAllUserFavouritesAdvertisements(@PathVariable String username, Principal principal, @RequestBody List<String> uuidStringList){
        return publicAdvertisementService.getAllUserFavouritesAdvertisements(username,principal.getName(),uuidStringList);
    }
}
