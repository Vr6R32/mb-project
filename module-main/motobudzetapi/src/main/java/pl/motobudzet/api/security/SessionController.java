package pl.motobudzet.api.security;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.nio.file.Path;
import java.nio.file.Paths;

import static pl.motobudzet.api.security.ScreenCapture.captureScreen;

@RestController
@RequiredArgsConstructor
public class SessionController {
    private final SessionListener sessionListener;

    @GetMapping("api/session")
    public void getSession(@RequestParam String sessionId) {
        sessionListener.getSessionDetails(sessionId);
    }

}
