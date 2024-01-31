package pl.motobudzet.api.domain.brand;

import lombok.AllArgsConstructor;

import java.util.List;

@AllArgsConstructor
public class BrandFacade {

    private final BrandService brandService;

    public List<BrandDTO> getAllBrands() {
        return brandService.getAllBrands();
    }

    public Brand getBrand(String brand) {
        return brandService.getBrand(brand);
    }
}
