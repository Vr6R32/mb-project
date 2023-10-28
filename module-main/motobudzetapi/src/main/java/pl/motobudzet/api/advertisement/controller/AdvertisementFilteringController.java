package pl.motobudzet.api.advertisement.controller;


import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import pl.motobudzet.api.advertisement.dto.AdvertisementDTO;
import pl.motobudzet.api.advertisement.dto.AdvertisementFilterRequest;
import pl.motobudzet.api.advertisement.service.AdvertisementFilteringService;

@RestController
@RequestMapping(value = "api/advertisements/filter")
public class AdvertisementFilteringController {

    private final AdvertisementFilteringService advertisementFilteringService;

    public AdvertisementFilteringController(AdvertisementFilteringService advertisementFilteringService) {
        this.advertisementFilteringService = advertisementFilteringService;
    }

    @GetMapping("/search")
    public Page<AdvertisementDTO> findAllPublicWithFilters(
            @ModelAttribute AdvertisementFilterRequest request,
            @RequestParam(required = false) Integer pageNumber,
            @RequestParam(required = false, defaultValue = "price") String sortBy,
            @RequestParam(required = false, defaultValue = "ASC") String sortOrder
    ) {
        return advertisementFilteringService.findAllPublicWithFilters(request, pageNumber, sortBy, sortOrder);

    }
    @GetMapping("/count")
    public long getAdvertisementsCount(
            @ModelAttribute AdvertisementFilterRequest request,
            @RequestParam(required = false) Integer pageNumber,
            @RequestParam(required = false, defaultValue = "price") String sortBy,
            @RequestParam(required = false, defaultValue = "ASC") String sortOrder) {
        return advertisementFilteringService.getFilterResultCount(request, pageNumber, sortBy, sortOrder);
    }
}

