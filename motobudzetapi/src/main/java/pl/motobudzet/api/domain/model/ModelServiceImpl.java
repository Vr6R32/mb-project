package pl.motobudzet.api.domain.model;

import pl.motobudzet.api.dto.ModelDTO;
import pl.motobudzet.api.infrastructure.mapper.ModelMapper;
import pl.motobudzet.api.persistance.ModelRepository;

import java.security.InvalidParameterException;
import java.util.List;

class ModelServiceImpl implements ModelService {

    private final ModelRepository modelRepository;

    public ModelServiceImpl(ModelRepository modelRepository) {
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
