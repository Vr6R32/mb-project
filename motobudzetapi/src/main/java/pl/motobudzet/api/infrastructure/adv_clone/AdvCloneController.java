package pl.motobudzet.api.infrastructure.adv_clone;


import com.fasterxml.jackson.databind.JsonNode;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RequestMapping("api/v1/clone")
@RestController
public class AdvCloneController {

    private final AdvCloneService advCloneService;

    @GetMapping
    @Operation(summary = "Clone Advertisement from Otomoto",
            description = "Clone advertisement from Otomoto based on the provided URL. Note: This is a non-functional feature not available in production.")
    public JsonNode cloneAdvertisement(@RequestParam String url) {
        return advCloneService.cloneThirdPartyAdvertisement(url);
    }


}
