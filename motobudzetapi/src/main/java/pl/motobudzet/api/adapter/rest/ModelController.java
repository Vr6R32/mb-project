package pl.motobudzet.api.adapter.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.motobudzet.api.adapter.facade.ModelFacade;
import pl.motobudzet.api.domain.model.Model;
import pl.motobudzet.api.dto.ModelDTO;

import java.util.List;

@RestController
@RequestMapping(value = "api/models")
class ModelController {

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
