package pl.motobudzet.api.domain.brand;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "api/brands")
@AllArgsConstructor
public class BrandController {

    private final BrandFacade brandFacade;

    @GetMapping
    public List<BrandDTO> getAllBrands() {
        return brandFacade.getAllBrands();
    }
}
