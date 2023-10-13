package pl.motobudzet.api.fileManager.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.motobudzet.api.advertisement.entity.Advertisement;
import pl.motobudzet.api.advertisement.repository.AdvertisementRepository;
import pl.motobudzet.api.advertisement.service.PublicAdvertisementService;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class PublicAdvertisementImageService {

    public static final int PHOTO_TARGET_WIDTH = 1920;
    public static final String PUBLIC_FILE_PATH = "module-main/files/public/";
    public static final String PRIVATE_FILE_PATH = "module-main/files/private/";
    List<String> fileTypeAllowed = Arrays.asList("image/jpeg", "image/png");

    private final PublicAdvertisementService advertisementService;


    @Transactional
    public ResponseEntity<String> uploadAndProcessImagesWithLogo(String advertisementId, String mainPhotoUrl, List<MultipartFile> files) {
        Advertisement advertisement = advertisementService.getAdvertisement(advertisementId);

        int rowAffected = 0;

        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                return new ResponseEntity<>("can't upload empty file!", HttpStatus.BAD_REQUEST);
            }

            if (!fileTypeAllowed.contains(file.getContentType())) {
                return new ResponseEntity<>("can't upload that file type!", HttpStatus.BAD_REQUEST);
            }

            String fileName = advertisement.getName() + '-' + UUID.randomUUID() + '-' + file.getOriginalFilename();

            int inserted = processAndSaveImageWithLogo(file, fileName, advertisement);

            rowAffected += inserted;

        }

        String redirectUrl = "/id?advertisementId=" + advertisement.getId();
        if (rowAffected > 0) {
            return ResponseEntity.ok().header("Location", redirectUrl).body("inserted !" + rowAffected);
        } else {
            return new ResponseEntity<>("failed to insert image", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private int processAndSaveImageWithLogo(MultipartFile file, String fileName, Advertisement advertisement) {
        Path targetPath = Paths.get(PUBLIC_FILE_PATH, fileName);

        try {
            // Zapisywanie pliku
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // Przetwarzanie i zapisywanie obrazu
            BufferedImage image = ImageIO.read(file.getInputStream());
            int originalWidth = image.getWidth();
            int originalHeight = image.getHeight();
            int maxWidth = 2560;
            int maxHeight = 2560;

            // Skalowanie obrazu, jeśli wymiary przekraczają maksymalne
            if (originalWidth > maxWidth || originalHeight > maxHeight) {
                double widthRatio = (double) originalWidth / maxWidth;
                double heightRatio = (double) originalHeight / maxHeight;
                double scaleRatio = Math.max(widthRatio, heightRatio);

                int newWidth = (int) (originalWidth / scaleRatio);
                int newHeight = (int) (originalHeight / scaleRatio);

                BufferedImage resizedImage = new BufferedImage(newWidth, newHeight, image.getType());
                Graphics2D g = resizedImage.createGraphics();
                g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
                g.drawImage(image, 0, 0, newWidth, newHeight, null);
                g.dispose();

                // Nadpisanie pliku przeskalowanym obrazem
                ImageIO.write(resizedImage, "jpg", targetPath.toFile());
            }

            // Przeskaluj logo
            InputStream logoInputStream = getClass().getResourceAsStream("/logo.png");
            BufferedImage logo = ImageIO.read(logoInputStream);

            int logoWidth = logo.getWidth();
            int logoHeight = logo.getHeight();

            double scale = (double) originalWidth / maxWidth;
            int newLogoWidth = (int) (logoWidth * scale);
            int newLogoHeight = (int) (logoHeight * scale);

            BufferedImage scaledLogo = new BufferedImage(newLogoWidth, newLogoHeight, logo.getType());
            Graphics2D logoGraphics = scaledLogo.createGraphics();
            logoGraphics.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
            logoGraphics.drawImage(logo, 0, 0, newLogoWidth, newLogoHeight, null);
            logoGraphics.dispose();

            // Oblicz pozycję logo na obrazie (prawy dolny róg)
            int logoX = originalWidth - newLogoWidth - 10;
            int logoY = originalHeight - newLogoHeight - 10;

            BufferedImage imageWithScaledLogo = new BufferedImage(originalWidth, originalHeight, BufferedImage.TYPE_INT_RGB);
            Graphics2D g = imageWithScaledLogo.createGraphics();
            g.drawImage(image, 0, 0, null);
            g.drawImage(scaledLogo, logoX, logoY, null);
            g.dispose();

            // Zapisz obraz z logo
            ImageIO.write(imageWithScaledLogo, "jpg", targetPath.toFile());

            // Aktualizacja głównego URL zdjęcia
            if (advertisement.getMainPhotoUrl() == null) {
                advertisement.setMainPhotoUrl(fileName);
                advertisementService.saveAdvertisement(advertisement);
            }
            return advertisementService.insertPhotoToAdvertisement(advertisement.getId(), fileName);
        } catch (IOException e) {
            throw new RuntimeException("Failed to save the file.", e);
        }
    }
}