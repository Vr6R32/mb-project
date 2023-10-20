package pl.motobudzet.api.advertisement.controller;


import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import pl.motobudzet.api.advertisement.dto.AdvertisementDTO;
import pl.motobudzet.api.advertisement.service.AdvertisementFilteringService;

import java.util.List;

@RestController
@RequestMapping(value = "api/advertisements/filter")
public class AdvertisementFilteringController {

    private final AdvertisementFilteringService advertisementFilteringService;

    public AdvertisementFilteringController(AdvertisementFilteringService advertisementFilteringService) {
        this.advertisementFilteringService = advertisementFilteringService;
    }

    @GetMapping("/search")
    public Page<AdvertisementDTO> findAllPublicWithFilters(
            @RequestParam(required = false) Integer pageNumber,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) String fuelType,
            @RequestParam(required = false) String driveType,
            @RequestParam(required = false) String engineType,
            @RequestParam(required = false) String transmissionType,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String cityState,
            @RequestParam(required = false) Long priceMin,
            @RequestParam(required = false) Long priceMax,
            @RequestParam(required = false) Long mileageFrom,
            @RequestParam(required = false) Long mileageTo,
            @RequestParam(required = false) Long engineCapacityFrom,
            @RequestParam(required = false) Long engineCapacityTo,
            @RequestParam(required = false) Long engineHorsePowerFrom,
            @RequestParam(required = false) Long engineHorsePowerTo,
            @RequestParam(required = false) Long productionDateFrom,
            @RequestParam(required = false) Long productionDateTo,
            @RequestParam(required = false,defaultValue = "0") Integer distanceFrom,
            @RequestParam(required = false, defaultValue = "price") String sortBy,
            @RequestParam(required = false, defaultValue = "ASC") String sortOrder
    ) {
        return advertisementFilteringService.findAllPublicWithFilters(pageNumber, brand, model, fuelType, driveType, engineType, transmissionType,city,cityState, priceMin, priceMax,
                mileageFrom, mileageTo, engineCapacityFrom,
                engineCapacityTo, engineHorsePowerFrom,
                engineHorsePowerTo, productionDateFrom,
                productionDateTo, distanceFrom, sortBy, sortOrder);
    }
}

