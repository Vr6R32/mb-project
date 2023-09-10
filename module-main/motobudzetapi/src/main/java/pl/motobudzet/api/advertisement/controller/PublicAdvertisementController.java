package pl.motobudzet.api.advertisement.controller;


import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.motobudzet.api.advertisement.dto.AdvertisementCreateRequest;
import pl.motobudzet.api.advertisement.dto.AdvertisementDTO;
import pl.motobudzet.api.advertisement.service.PublicAdvertisementService;

import java.util.UUID;

@RestController
@RequestMapping(value = "api/advertisements")
public class PublicAdvertisementController {

    private final PublicAdvertisementService publicAdvertisementService;

    public PublicAdvertisementController(PublicAdvertisementService publicAdvertisementService) {
        this.publicAdvertisementService = publicAdvertisementService;
    }

    @GetMapping("/last-uploaded")
    public Page<AdvertisementDTO> findLastUploaded(@RequestParam(required = false) Integer pageNumber, @RequestParam(required = false, defaultValue = "3") Integer pageSize) {
        return publicAdvertisementService.findLastUploaded(pageNumber, pageSize);
    }

    @GetMapping("/{id}")
    public AdvertisementDTO findOneByIdWithFetch(@PathVariable UUID id) {
        return publicAdvertisementService.findOneByIdWithFetch(id);
    }

    @PostMapping(consumes = "application/json")
    public ResponseEntity<String> createNewAdvertisement(@RequestBody @Valid AdvertisementCreateRequest request) {
        return publicAdvertisementService.createNewAdvertisement(request);
    }

    @PutMapping(value = "/{id}", consumes = "application/json")
    public String editExistingAdvertisement(@PathVariable String id,
                                            @RequestBody @Valid AdvertisementCreateRequest request) {
        return publicAdvertisementService.editExistingAdvertisement(id, request);
    }

}