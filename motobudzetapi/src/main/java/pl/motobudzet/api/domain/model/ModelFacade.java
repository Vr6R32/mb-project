package pl.motobudzet.api.domain.model;

import lombok.AllArgsConstructor;

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
