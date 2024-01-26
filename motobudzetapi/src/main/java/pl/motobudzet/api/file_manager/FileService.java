package pl.motobudzet.api.file_manager;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.motobudzet.api.advertisement.entity.Advertisement;
import pl.motobudzet.api.advertisement.service.AdvertisementService;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class FileService {

    private final AdvertisementService advertisementService;
    private final PathsConfig pathsConfig;
    private final EntityManager entityManager;

    List<String> fileTypeAllowed = Arrays.asList("image/jpeg", "image/png", "image/heif", "image/heic", "image/webp");


    public FileService(@Lazy AdvertisementService advertisementService, PathsConfig pathsConfig, EntityManager entityManager) {
        this.advertisementService = advertisementService;
        this.pathsConfig = pathsConfig;
        this.entityManager = entityManager;
    }


    public Resource getAdvertisementPhoto(String imageUrl) {
        File file = new File(pathsConfig.getPublicFilePath() + imageUrl);
        return new FileSystemResource(file);
    }

    @Transactional
    public String verifySortAndSaveImages(UUID advertisementId, List<MultipartFile> files) {

        Advertisement advertisement = advertisementService.getAdvertisement(advertisementId);

        List<String> existingImages = advertisement.getImageUrls();

        List<MultipartFile> filteredFilesToUpload = files.stream()
                .filter(file -> !existingImages.contains(file.getOriginalFilename()))
                .toList();

        List<String> filenames = files.stream()
                .map(MultipartFile::getOriginalFilename).collect(Collectors.toList());

        for (MultipartFile file : filteredFilesToUpload) {
            if (file.isEmpty()) {
                return null;
            }

            if (!fileTypeAllowed.contains(file.getContentType())) {
                return null;
            }

            String fileName = advertisement.getName() + '-' + file.getOriginalFilename();
            int indexToUpdate = filenames.indexOf(file.getOriginalFilename());
            if (indexToUpdate != -1) {
                filenames.set(indexToUpdate, fileName);
            }

            processAndSaveImageWithLogo(file, fileName);
        }

        LinkedHashSet<String> uniqueFilenamesSet = new LinkedHashSet<>(filenames);

        int photosInsertedCount = insertNewPhotos(advertisementId, uniqueFilenamesSet);

        return uniqueFilenamesSet.stream().findFirst().get();
    }

    private void saveImage(MultipartFile file, String fileName) {
        Path targetPath = Paths.get(pathsConfig.getPublicFilePath(), fileName);
        try {
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }


    @Modifying
    @Transactional
    public int insertNewPhotos(UUID id, Set<String> names) {

        Query deleteQuery = entityManager.createNativeQuery("DELETE FROM advertisement_images WHERE advertisement_id = ?");
        deleteQuery.setParameter(1, id);
        deleteQuery.executeUpdate();

        String baseQuery = "INSERT INTO advertisement_images (advertisement_id, image_urls) VALUES ";
        List<Object[]> params = new ArrayList<>();

        StringBuilder values = new StringBuilder();
        for (String name : names) {
            values.append("(?, ?),");
            params.add(new Object[]{id, name});
        }

        if (values.length() > 0) {
            values.setLength(values.length() - 1);
        }

        Query query = entityManager.createNativeQuery(baseQuery + values.toString());
        for (int i = 0; i < params.size(); i++) {
            Object[] paramSet = params.get(i);
            query.setParameter((i * 2) + 1, paramSet[0]);
            query.setParameter((i * 2) + 2, paramSet[1]);
        }

        return query.executeUpdate();
    }

    private void processAndSaveImageWithLogo(MultipartFile file, String fileName) {
        try {
            Path targetPath = Paths.get(pathsConfig.getPublicFilePath(), fileName);
            BufferedImage originalImage = readImageFromMultipartFile(file);
            BufferedImage processedImage = processImage(originalImage);
            saveImage(processedImage, targetPath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to save the file.", e);
        }
    }

    private BufferedImage readImageFromMultipartFile(MultipartFile file) throws IOException {
        try (InputStream fileInputStream = file.getInputStream()) {
            return ImageIO.read(fileInputStream);
        }
    }

    private BufferedImage processImage(BufferedImage originalImage) throws IOException {
        int maxWidth = 2560;
        int maxHeight = 2560;

        BufferedImage scaledImage = scaleImageIfNeeded(originalImage, maxWidth, maxHeight);
        BufferedImage logo = loadLogo();
        return addLogoToImage(scaledImage, logo);
    }

    private BufferedImage scaleImageIfNeeded(BufferedImage image, int maxWidth, int maxHeight) {
        int originalWidth = image.getWidth();
        int originalHeight = image.getHeight();

        if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
            return image;
        }

        double scaleRatio = Math.max((double) originalWidth / maxWidth, (double) originalHeight / maxHeight);
        int newWidth = (int) (originalWidth / scaleRatio);
        int newHeight = (int) (originalHeight / scaleRatio);

        BufferedImage scaledImage = new BufferedImage(newWidth, newHeight, image.getType());
        Graphics2D g = scaledImage.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g.drawImage(image, 0, 0, newWidth, newHeight, null);
        g.dispose();

        return scaledImage;
    }

    private BufferedImage loadLogo() throws IOException {
        try (InputStream logoInputStream = getClass().getResourceAsStream("/logo.png")) {
            return ImageIO.read(logoInputStream);
        }
    }

    private BufferedImage addLogoToImage(BufferedImage image, BufferedImage logo) {
        final double logoMaxWidthRatio = 0.25; // Logo zajmie do 15% szerokości obrazu
        final double logoMaxHeightRatio = 0.25; // Logo zajmie do 15% wysokości obrazu

        int logoMaxWidth = (int) (image.getWidth() * logoMaxWidthRatio);
        int logoMaxHeight = (int) (image.getHeight() * logoMaxHeightRatio);

        // Oblicz skalę dla logo w oparciu o maksymalne proporcje
        double scaleWidth = (double) logoMaxWidth / logo.getWidth();
        double scaleHeight = (double) logoMaxHeight / logo.getHeight();
        double scale = Math.min(scaleWidth, scaleHeight);

        // Oblicz nowe wymiary logo
        int newLogoWidth = (int) (logo.getWidth() * scale);
        int newLogoHeight = (int) (logo.getHeight() * scale);

        // Utwórz przeskalowane logo
        BufferedImage scaledLogo = new BufferedImage(newLogoWidth, newLogoHeight, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2dLogo = scaledLogo.createGraphics();
        g2dLogo.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g2dLogo.drawImage(logo, 0, 0, newLogoWidth, newLogoHeight, null);
        g2dLogo.dispose();

        // Umieść logo w prawym dolnym rogu obrazu
        BufferedImage combinedImage = new BufferedImage(image.getWidth(), image.getHeight(), BufferedImage.TYPE_INT_RGB);
        Graphics2D g2dImage = combinedImage.createGraphics();
        g2dImage.drawImage(image, 0, 0, null);
        g2dImage.drawImage(scaledLogo, image.getWidth() - newLogoWidth - 10, image.getHeight() - newLogoHeight - 10, null);
        g2dImage.dispose();

        return combinedImage;
    }

    private void saveImage(BufferedImage image, Path targetPath) throws IOException {
        ImageIO.write(image, "webp", targetPath.toFile());
    }
}