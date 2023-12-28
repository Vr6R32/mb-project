package pl.motobudzet.api.utils.adv_clone;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("api/v1/clone")
@RestController
public class AdvCloneController {

    private final AdvCloneService advCloneService;

    @GetMapping
    public List<String> cloneAdvertisement(@RequestParam String url){
        return advCloneService.cloneThirdPartyAdvertisement(url);
    }


}
