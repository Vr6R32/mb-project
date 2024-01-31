package pl.motobudzet.api.domain.advertisement.controller;


import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import pl.motobudzet.api.domain.advertisement.service.AdvertisementFacade;
import pl.motobudzet.api.domain.advertisement.dto.AdvertisementDTO;
import pl.motobudzet.api.domain.advertisement.dto.AdvertisementFilterRequest;

@RestController
@RequestMapping(value = "api/advertisements/filter")
@AllArgsConstructor
public class AdvertisementFilteringController {

    private final AdvertisementFacade advertisementFacade;

    @GetMapping("/search")
    public Page<AdvertisementDTO> getAdvertisementsByFilter(
            @ModelAttribute AdvertisementFilterRequest request,
            @RequestParam(required = false) Integer pageNumber,
            @RequestParam(required = false, defaultValue = "price") String sortBy,
            @RequestParam(required = false, defaultValue = "ASC") String sortOrder
    ) {
        return advertisementFacade.getFilteredAdvertisements(request, pageNumber, sortBy, sortOrder);

    }

    @GetMapping("/count")
    public long getAdvertisementsCount(
            @ModelAttribute AdvertisementFilterRequest request) {
        return advertisementFacade.getFilterResultCount(request);
    }
}

