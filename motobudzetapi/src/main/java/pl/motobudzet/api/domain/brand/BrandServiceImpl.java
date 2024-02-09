package pl.motobudzet.api.domain.brand;

import pl.motobudzet.api.dto.BrandDTO;
import pl.motobudzet.api.infrastructure.mapper.BrandMapper;
import pl.motobudzet.api.persistance.BrandRepository;

import java.security.InvalidParameterException;
import java.util.List;


class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;

    public BrandServiceImpl(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }
    public List<BrandDTO> getAllBrands() {
        return brandRepository.findAllBrands().stream().map(BrandMapper::mapToBrandDTO).toList();
    }

    public Brand getBrand(String brand) {
        return brandRepository.findByName(brand.toUpperCase()).orElseThrow(() -> new InvalidParameterException("model doesnt exists !"));
    }
}
