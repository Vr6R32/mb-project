package pl.motobudzet.api.domain.model;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "api/models")
public class ModelController {

    private final ModelFacade modelFacade;

    public ModelController(ModelFacade modelFacade) {
        this.modelFacade = modelFacade;
    }

    @GetMapping("/all")
    public List<Model> findAllModels() {
        return modelFacade.getModels();
    }

    @GetMapping("/{brandName}")
    public List<ModelDTO> getModelsByBrandName(@PathVariable String brandName) {
        return modelFacade.getModelsByBrandName(brandName);
    }
}
