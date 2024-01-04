package pl.motobudzet.api.z_playground.stream;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.imageio.ImageIO;
import javax.sound.sampled.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.nio.file.Path;
import java.nio.file.Paths;

import static pl.motobudzet.api.z_playground.stream.ScreenCapture.captureScreen;

@RestController
public class StreamController {

    private ByteArrayOutputStream audioStream;
    private AudioFormat format;
    private TargetDataLine targetLine;

//    public StreamController() {
//        this.audioStream = new ByteArrayOutputStream();
//        this.format = new AudioFormat(16000, 16, 2, true, true);
//        try {
//            DataLine.Info info = new DataLine.Info(TargetDataLine.class, format);
//            if (!AudioSystem.isLineSupported(info)) {
//                System.out.println("Line not supported");
//            } else {
//                targetLine = (TargetDataLine) AudioSystem.getLine(info);
//                targetLine.open();
//                targetLine.start();
//                captureAudio();
//            }
//        } catch (LineUnavailableException e) {
//            e.printStackTrace();
//        }
//    }

    private void captureAudio() {
        Thread captureThread = new Thread(() -> {
            byte[] buffer = new byte[1024];
            while (true) {
                int bytesRead = targetLine.read(buffer, 0, buffer.length);
                audioStream.write(buffer, 0, bytesRead);
            }
        });
        captureThread.start();
    }

    @GetMapping(value = "/audio-capture", produces = "audio/wav")
    public ResponseEntity<byte[]> getAudioCapture() {
        byte[] audioBytes = audioStream.toByteArray();
        audioStream.reset();
        return ResponseEntity.ok(audioBytes);
    }

    @GetMapping(value = "/screen-capture", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getScreenCapture() {

        System.setProperty("java.awt.headless", "false");

        try {
            BufferedImage capturedImage = captureScreen(3000, 0, 2120, 1440);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(capturedImage, "png", baos);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(baos.toByteArray());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }


    @GetMapping("/video")
    public ResponseEntity<Resource> getVideo() {
        try {
            Path videoPath = Paths.get("C:\\Users\\kowal\\Documents\\Bandicam\\bandicam 2023-12-29 21-21-23-940.mp4");
            Resource video = new UrlResource(videoPath.toUri());

            if (video.exists() || video.isReadable()) {
                return ResponseEntity
                        .ok()
                        .contentType(MediaType.parseMediaType("video/mp4"))
                        .body(video);
            } else {
                throw new RuntimeException("Nie można odczytać pliku");
            }

        } catch (Exception e) {
            throw new RuntimeException("Błąd podczas ładowania pliku", e);
        }
    }

}
