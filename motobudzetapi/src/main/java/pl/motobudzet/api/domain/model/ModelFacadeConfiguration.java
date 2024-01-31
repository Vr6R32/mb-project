package pl.motobudzet.api.domain.model;


import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@AllArgsConstructor
public class ModelFacadeConfiguration {

    private final ModelRepository modelRepository;

    @Bean
    ModelFacade modelFacade() {
        ModelService modelService = new ModelService(modelRepository);
        return new ModelFacade(modelService);
    }
}
