package pl.motobudzet.api.vehicle_model;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "api/models")
public class ModelController {

    private final ModelService modelService;

    public ModelController(ModelService modelService) {
        this.modelService = modelService;
    }

    @GetMapping("/all")
    public List<Model> findAllModels() {
        return modelService.findAllModels();
    }

    @GetMapping("/{brandName}")
    public List<ModelDTO> findModelsByBrandName(@PathVariable String brandName) {
        return modelService.findModelsByBrandName(brandName);
    }
}
