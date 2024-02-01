package pl.motobudzet.api.adapter.facade.config;


import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pl.motobudzet.api.adapter.facade.ModelFacade;
import pl.motobudzet.api.domain.model.FactoryModelService;
import pl.motobudzet.api.domain.model.ModelService;
import pl.motobudzet.api.persistance.ModelRepository;

@Configuration
@AllArgsConstructor
public class ModelFacadeConfiguration {

    private final ModelRepository modelRepository;

    @Bean
    ModelFacade modelFacade() {
        ModelService modelService = FactoryModelService.createModelService(modelRepository);
        return new ModelFacade(modelService);
    }
}
