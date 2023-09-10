package pl.motobudzet.api.resources.service;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

@Service
public class ResourceImageService {

    public static final String PUBLIC_FILE_PATH = "files/public/";

    public Resource getAdvertisementPhoto(String imageUrl) {
        File originalImageFile = new File(PUBLIC_FILE_PATH + imageUrl);
        BufferedImage originalImage;
        try {
            originalImage = ImageIO.read(originalImageFile);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        int borderSize = 10; // Grubość obwódki (możesz dostosować wartość do swoich potrzeb)
        Color backgroundColor = new Color(255, 255, 255, 0); // Kolor tła z pełną przezroczystością (RGBA)

        // Tworzenie nowego obrazu z efektem przezroczystej obwódki
        int newWidth = originalImage.getWidth() + 2 * borderSize;
        int newHeight = originalImage.getHeight() + 2 * borderSize;
        BufferedImage borderedImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_ARGB);

        Graphics2D g = borderedImage.createGraphics();
        g.setColor(backgroundColor);
        g.fillRect(0, 0, newWidth, newHeight);
        g.drawImage(originalImage, borderSize, borderSize, null);
        g.dispose();


        // Zapis nowego obrazu do pliku tymczasowego
        File borderedImageFile = new File(PUBLIC_FILE_PATH + "test");
        try {
            ImageIO.write(borderedImage, "png", borderedImageFile);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        // Zwrócenie obrazu jako zasobu Spring Resource
        return new FileSystemResource(borderedImageFile);
    }

    public Resource getAdvertisementPhotoMiniature400x300(String imageUrl) {
        int width = 400;
        int height = 300;
        return getResource(imageUrl, width, height);
    }

    private Resource getResource(String imageUrl, int width, int height) {
        try {
            BufferedImage originalImage = ImageIO.read(new File(PUBLIC_FILE_PATH + imageUrl));

            // Skalowanie obrazu do żądanych wymiarów
            Image scaledImage = originalImage.getScaledInstance(width, height, Image.SCALE_SMOOTH);
            BufferedImage resizedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
            Graphics2D graphics2D = resizedImage.createGraphics();
            graphics2D.drawImage(scaledImage, 0, 0, null);
            graphics2D.dispose();

            // Tworzenie zasobu z zeskalowanym obrazem
            File tempFile = File.createTempFile("scaledImage", ".jpg");
            ImageIO.write(resizedImage, "jpg", tempFile);
            return new FileSystemResource(tempFile);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public Resource getAdvertisementPhotoMiniature150x150(String imageUrl) {
        int width = 150;
        int height = 150;
        return getResource(imageUrl, width, height);
    }

    public Resource getAdvertisementPhotoHalfMiniature(String imageUrl) {
        int maxHeight = 675;
        try {
            BufferedImage originalImage = ImageIO.read(new File(PUBLIC_FILE_PATH + imageUrl));

            int originalWidth = originalImage.getWidth();
            int originalHeight = originalImage.getHeight();

            // Obliczanie docelowej szerokości na podstawie maksymalnej wysokości i proporcji
            int targetWidth = originalWidth * maxHeight / originalHeight;

            // Skalowanie obrazu do docelowych wymiarów
            Image scaledImage = originalImage.getScaledInstance(targetWidth, maxHeight, Image.SCALE_SMOOTH);
            BufferedImage resizedImage = new BufferedImage(targetWidth, maxHeight, BufferedImage.TYPE_INT_RGB);
            Graphics2D graphics2D = resizedImage.createGraphics();
            graphics2D.drawImage(scaledImage, 0, 0, null);
            graphics2D.dispose();

            // Tworzenie zasobu z zeskalowanym obrazem
            File tempFile = File.createTempFile("scaledImage", ".jpg");
            ImageIO.write(resizedImage, "jpg", tempFile);
            return new FileSystemResource(tempFile);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
