package pl.motobudzet.api.z_playground.session;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class SessionController {
    private final SessionListener sessionListener;

    @GetMapping("api/session")
    public void getSession(@RequestParam String sessionId) {
        sessionListener.getSessionDetails(sessionId);
    }

}
