package pl.motobudzet.api.vehicleBrand.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.motobudzet.api.vehicleBrand.dto.BrandDTO;
import pl.motobudzet.api.vehicleBrand.entity.Brand;
import pl.motobudzet.api.vehicleBrand.service.BrandService;

import java.util.List;

@RestController
@RequestMapping(value = "api/brands")
public class BrandController {

    private final BrandService brandService;

    public BrandController(BrandService brandService) {
        this.brandService = brandService;
    }

    @GetMapping
    public List<Brand> findAllBrandWithOutModel() {
        return brandService.findAllBrandWithOutModel();
    }

    @GetMapping("/with-model")
    public List<BrandDTO> findAllBrandWithModel() {
        return brandService.findAllBrandWithModel();
    }

    // TODO @Preauthorize ROLE ADMIN
    @PostMapping
    public ResponseEntity<String> insertNewBrand(@RequestParam String brand) {
        return brandService.insertNewBrand(brand);
    }

    // TODO @Preauthorize ROLE ADMIN
    @DeleteMapping("/")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<String> deleteBrand(@RequestParam String brand) {
        return brandService.deleteBrand(brand);
    }


}
