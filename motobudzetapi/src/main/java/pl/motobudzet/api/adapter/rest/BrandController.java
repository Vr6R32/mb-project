package pl.motobudzet.api.adapter.rest;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pl.motobudzet.api.dto.BrandDTO;
import pl.motobudzet.api.adapter.facade.BrandFacade;

import java.util.List;

@RestController
@RequestMapping(value = "api/brands")
@AllArgsConstructor
class BrandController {

    private final BrandFacade brandFacade;

    @GetMapping
    public List<BrandDTO> getAllBrands() {
        return brandFacade.getAllBrands();
    }
}
