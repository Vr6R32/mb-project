package pl.motobudzet.api.domain.brand;

import pl.motobudzet.api.persistance.BrandRepository;

public class FactoryBrandService {

    private FactoryBrandService() {
    }

    public static BrandService createBrandService(BrandRepository brandRepository) {
        return new BrandServiceImpl(brandRepository);
    }
}
