package pl.motobudzet.api.advertisement.controller;


import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import pl.motobudzet.api.advertisement.dto.AdvertisementDTO;
import pl.motobudzet.api.advertisement.service.AdminAdvertisementService;

@RestController
@RequestMapping(value = "api/advertisements/")
public class AdminAdvertisementController {

    private final AdminAdvertisementService adminAdvertisementService;

    public AdminAdvertisementController(AdminAdvertisementService adminAdvertisementService) {
        this.adminAdvertisementService = adminAdvertisementService;
    }

    @GetMapping("all-to-verify")
    public Page<AdvertisementDTO> findAllAdvertisementsToVerify(@RequestParam(required = false) Integer pageNumber) {
        return adminAdvertisementService.findAllAdvertisementsToVerify(pageNumber);
    }

    @PostMapping("verify/{id}")
    public String verifyAndEnableAdvertisement(@PathVariable String id) {
        return adminAdvertisementService.verifyAndEnableAdvertisement(id);
    }

    @DeleteMapping("{id}")
    public String deleteAdvertisement(@PathVariable String id) {
        return adminAdvertisementService.deleteAdvertisement(id);
    }

}
