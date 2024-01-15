package pl.motobudzet.api.utils.adv_clone;


import com.fasterxml.jackson.databind.JsonNode;
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
    public JsonNode cloneAdvertisement(@RequestParam String url) {
        return advCloneService.cloneThirdPartyAdvertisement(url);
    }


}
