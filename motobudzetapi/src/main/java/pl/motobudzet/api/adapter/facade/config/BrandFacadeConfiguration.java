package pl.motobudzet.api.adapter.facade.config;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pl.motobudzet.api.adapter.facade.BrandFacade;
import pl.motobudzet.api.domain.brand.BrandService;
import pl.motobudzet.api.domain.brand.FactoryBrandService;
import pl.motobudzet.api.persistance.BrandRepository;

@Configuration
@AllArgsConstructor
class BrandFacadeConfiguration {

    private final BrandRepository brandRepository;

    @Bean
    public BrandFacade brandFacade() {
        BrandService brandService = FactoryBrandService.createBrandService(brandRepository);
        return new BrandFacade(brandService);
    }
}
