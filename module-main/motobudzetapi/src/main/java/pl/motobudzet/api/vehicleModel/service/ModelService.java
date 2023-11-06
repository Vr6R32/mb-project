package pl.motobudzet.api.vehicleModel.service;

import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.vehicleBrand.entity.Brand;
import pl.motobudzet.api.vehicleBrand.repository.BrandRepository;
import pl.motobudzet.api.vehicleModel.dto.ModelDTO;
import pl.motobudzet.api.vehicleModel.entity.Model;
import pl.motobudzet.api.vehicleModel.repository.ModelRepository;

import java.security.InvalidParameterException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ModelService {

    private final ModelRepository modelRepository;
    private final BrandRepository brandRepository;

    public ModelService(ModelRepository modelRepository, BrandRepository brandRepository) {
        this.modelRepository = modelRepository;
        this.brandRepository = brandRepository;
    }

    public List<Model> findAllModels() {
        return modelRepository.findAll();
    }

    @Transactional
    public ResponseEntity<String> insertNewModel(String modelName, String brandName) {
        String modelUpperCase = modelName.toUpperCase();

        Brand brand = brandRepository.findByName(brandName.toUpperCase()).orElseThrow(() -> new RuntimeException("brand doesnt exists!"));

        if (modelRepository.findByNameAndBrandName(modelUpperCase,brandName).isPresent()) {
            throw new RuntimeException("model already exists!");
        }

        Model model = Model.builder().name(modelUpperCase).brand(brand).build();

        brand.addElement(model);

        brandRepository.save(brand);

        return new ResponseEntity<>("model inserted!", HttpStatus.CREATED);
    }

    public List<ModelDTO> findAllModelsFromSpecifiedBrand(String brandName) {
        return brandRepository.findModelsByBrandName(
                brandName.toUpperCase())
                .stream()
                .map(model -> ModelDTO.builder().name(model.getName()).build())
                .collect(Collectors.toList());
    }

    public ResponseEntity<String> deleteModel(String modelName, String brandName) {

        Model model = modelRepository.findByNameAndBrandName(modelName,brandName).orElseThrow(() -> new RuntimeException("MODEL_DOESNT_EXIST"));
        Brand brand = brandRepository.findByName(model.getBrand().getName().toUpperCase()).orElseThrow(() -> new RuntimeException("BRAND_DOESNT_EXIST"));

        model.setBrand(null);
        brand.deleteElement(model);
        modelRepository.delete(model);


//        brandRepository.save(brand);

        return new ResponseEntity<>("ok", HttpStatus.OK);
    }

    public Model getModelByBrand(String model,String brandName) {
        return modelRepository.findByNameAndBrandName(model.toUpperCase(),brandName.toUpperCase()).orElseThrow(() -> new InvalidParameterException("MODEL_DOESNT_EXIST"));
    }

    public Model getModel(String model) {
        return modelRepository.findByName(model.toUpperCase()).orElseThrow(() -> new InvalidParameterException("MODEL_DOESNT_EXIST"));
    }

    public String getModel(Long modelId) {
        Model model = modelRepository.findByAjdi(modelId).orElseThrow(() -> new RuntimeException("MODEL_DOESNT_EXIST"));
        return model.getName();
    }
}
