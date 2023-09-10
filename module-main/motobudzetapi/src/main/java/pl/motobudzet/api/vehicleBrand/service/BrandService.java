package pl.motobudzet.api.vehicleBrand.service;

import jakarta.transaction.Transactional;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.vehicleBrand.dto.BrandDTO;
import pl.motobudzet.api.vehicleBrand.entity.Brand;
import pl.motobudzet.api.vehicleBrand.repository.BrandRepository;

import java.security.InvalidParameterException;
import java.util.ArrayList;
import java.util.List;

@Service
public class BrandService {

    private final BrandRepository brandRepository;

    public BrandService(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    public List<Brand> findAllBrandWithOutModel() {
        return brandRepository.findAllBrandWithModel();
    }

    public List<BrandDTO> findAllBrandWithModel() {
        List<Brand> allBrandWithModel = brandRepository.findAllBrandWithModel();
        return allBrandWithModel.stream()
                .map(brand -> BrandDTO.builder().id(brand.getId()).name(brand.getName()).modelList(brand.getModelList()).build()).toList();
    }

    @CacheEvict(value = "vehicle_brand_cache_search_form", allEntries = true)
    public ResponseEntity<String> insertNewBrand(String brandName) {

        if (brandRepository.findByName(brandName.toUpperCase()).isPresent()) {
            return new ResponseEntity<>("brand already exists!", HttpStatus.BAD_REQUEST);
        } else {
            Brand brand = Brand.builder().name(brandName.toUpperCase()).modelList(new ArrayList<>()).build();
            brandRepository.save(brand);
        }
        return new ResponseEntity<>("brand inserted !", HttpStatus.CREATED);
    }


    @Transactional
    public ResponseEntity<String> deleteBrand(String brandName) {

        brandRepository.deleteByName(brandName.toUpperCase());

        return new ResponseEntity<>("delete succes !", HttpStatus.ACCEPTED);
    }

    public Brand getBrand(String brand) {
        return brandRepository.findByName(brand.toUpperCase()).orElseThrow(() -> new InvalidParameterException("model doesnt exists !"));
    }

    public String getBrand(Long brandId) {
        Brand brand = brandRepository.findByAjdi(brandId).orElseThrow(() -> new InvalidParameterException("wrong brand"));
        return brand.getName();
    }

}
