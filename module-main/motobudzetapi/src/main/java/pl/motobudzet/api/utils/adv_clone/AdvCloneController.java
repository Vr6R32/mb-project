package pl.motobudzet.api.utils.adv_clone;


import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RequestMapping("api/v1/clone")
@RestController
public class AdvCloneController {

    private final AdvCloneService advCloneService;

    @GetMapping
    public JsonNode cloneAdvertisement(@RequestParam String url){
        return advCloneService.cloneThirdPartyAdvertisement(url);
    }


}
