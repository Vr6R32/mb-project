package pl.motobudzet.api.domain.brand;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@AllArgsConstructor
public class BrandFacadeConfiguration {

    private final BrandRepository brandRepository;

    @Bean
    public BrandFacade brandFacade() {
        BrandService brandService = new BrandService(brandRepository);
        return new BrandFacade(brandService);
    }
}
