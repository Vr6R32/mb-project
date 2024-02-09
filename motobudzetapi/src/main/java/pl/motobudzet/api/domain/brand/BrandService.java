package pl.motobudzet.api.domain.brand;

import pl.motobudzet.api.dto.BrandDTO;

import java.util.List;

public interface BrandService {
    List<BrandDTO> getAllBrands();
    Brand getBrand(String brand);
}