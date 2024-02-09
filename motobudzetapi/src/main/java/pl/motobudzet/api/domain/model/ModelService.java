package pl.motobudzet.api.domain.model;

import pl.motobudzet.api.dto.ModelDTO;

import java.util.List;

public interface ModelService {
    List<Model> findAllModels();
    List<ModelDTO> findModelsByBrandName(String brandName);
    Model getModelByNameAndBrandName(String model, String brandName);
}