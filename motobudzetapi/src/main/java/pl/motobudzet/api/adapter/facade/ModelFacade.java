package pl.motobudzet.api.adapter.facade;

import lombok.AllArgsConstructor;
import pl.motobudzet.api.domain.model.Model;
import pl.motobudzet.api.dto.ModelDTO;
import pl.motobudzet.api.domain.model.ModelService;

import java.util.List;

@AllArgsConstructor
public class ModelFacade {

    private final ModelService modelService;

    public List<Model> getModels() {
        return modelService.findAllModels();
    }

    public List<ModelDTO> getModelsByBrandName(String brandName) {
        return modelService.findModelsByBrandName(brandName);
    }

    public Model getModelByNameAndBrandName(String model, String brandName) {
        return modelService.getModelByNameAndBrandName(model, brandName);
    }
}
