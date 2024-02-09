package pl.motobudzet.api.adapter.facade;

import lombok.AllArgsConstructor;
import pl.motobudzet.api.domain.brand.Brand;
import pl.motobudzet.api.domain.brand.BrandService;
import pl.motobudzet.api.dto.BrandDTO;

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
