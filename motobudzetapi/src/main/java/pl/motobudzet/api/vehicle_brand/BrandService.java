package pl.motobudzet.api.vehicle_brand;

import org.springframework.stereotype.Service;

import java.security.InvalidParameterException;
import java.util.List;

@Service
public class BrandService {

    private final BrandRepository brandRepository;

    public BrandService(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    public List<Brand> getAllBrands() {
        return brandRepository.findAllBrands();
    }

    public Brand getBrand(String brand) {
        return brandRepository.findByName(brand.toUpperCase()).orElseThrow(() -> new InvalidParameterException("model doesnt exists !"));
    }
}
