package pl.motobudzet.api.vehicleModel.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.motobudzet.api.vehicleModel.dto.ModelDTO;
import pl.motobudzet.api.vehicleModel.entity.Model;
import pl.motobudzet.api.vehicleModel.service.ModelService;

import java.util.List;

@RestController
@RequestMapping(value = "api/models")
public record ModelController(ModelService modelService) {

    @GetMapping("/all")
    public List<Model> findAllModels() {
        return modelService.findAllModels();
    }

    @GetMapping("/{brandName}")
    public List<ModelDTO> findAllModelsByBrandName(@PathVariable String brandName) {
        return modelService.findAllModelsByBrandName(brandName);
    }

    @PostMapping("/")
    public ResponseEntity<String> insertNewModel(@RequestParam String model, @RequestParam String brand) {
        return modelService.insertNewModel(model, brand);
    }

    @DeleteMapping("/")
    public ResponseEntity<String> deleteModel(@RequestParam String modelName, @RequestParam String brandName) {
        return modelService.deleteModel(modelName.toUpperCase(),brandName.toUpperCase());
    }

}
