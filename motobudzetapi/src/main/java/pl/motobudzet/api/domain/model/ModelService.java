package pl.motobudzet.api.domain.model;

import pl.motobudzet.api.infrastructure.mapper.ModelMapper;

import java.security.InvalidParameterException;
import java.util.List;

class ModelService {

    private final ModelRepository modelRepository;

    public ModelService(ModelRepository modelRepository) {
        this.modelRepository = modelRepository;
    }
    public List<Model> findAllModels() {
        return modelRepository.findAll();
    }
    public List<ModelDTO> findModelsByBrandName(String brandName) {
        return modelRepository.findAllModelsByBrandName(brandName.toUpperCase())
                .stream()
                .map(ModelMapper::mapToModelDTO)
                .toList();
    }

    public Model getModelByNameAndBrandName(String model, String brandName) {
        return modelRepository.findByNameAndBrandName(model, brandName).orElseThrow(() -> new InvalidParameterException("MODEL_DOESNT_EXIST"));
    }
}
