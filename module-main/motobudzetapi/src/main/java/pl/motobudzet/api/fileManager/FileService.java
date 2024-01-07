package pl.motobudzet.api.fileManager;

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
import pl.motobudzet.api.advertisement.service.UserAdvertisementService;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class FileService {

    private final UserAdvertisementService advertisementService;
    private final EntityManager entityManager;

    public static final String PUBLIC_FILE_PATH = "module-main/files/public/";
    public static final String PRIVATE_FILE_PATH = "module-main/files/private/";
    List<String> fileTypeAllowed = Arrays.asList("image/jpeg", "image/png", "image/heif", "image/heic", "image/webp");


    public FileService(@Lazy UserAdvertisementService advertisementService,EntityManager entityManager) {
        this.advertisementService = advertisementService;
        this.entityManager = entityManager;
    }


    public Resource getAdvertisementPhoto(String imageUrl) {
        File file = new File(PUBLIC_FILE_PATH + imageUrl);
        return new FileSystemResource(file);
    }

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
            if(indexToUpdate != -1) {
                filenames.set(indexToUpdate, fileName);
            }

            saveImage(file, fileName);
        }

        LinkedHashSet<String> uniqueFilenamesSet = new LinkedHashSet<>(filenames);

        int photosInsertedCount = insertNewPhotos(advertisementId, uniqueFilenamesSet);

        return uniqueFilenamesSet.stream().findFirst().get();
    }

    private void saveImage(MultipartFile file, String fileName) {
        Path targetPath = Paths.get(PUBLIC_FILE_PATH, fileName);
        try {
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        }  catch (Exception e){
            System.out.println(e.getMessage());
        }
    }



    @Modifying
    @Transactional
    public int insertNewPhotos(UUID id, LinkedHashSet<String> names) {

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

//    private void processAndSaveImageWithLogo(MultipartFile file, String fileName, Advertisement advertisement) {
//        Path targetPath = Paths.get(PUBLIC_FILE_PATH, fileName);
//
//        try {
//            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
//
//            BufferedImage image = ImageIO.read(file.getInputStream());
//            int originalWidth = image.getWidth();
//            int originalHeight = image.getHeight();
//            int maxWidth = 2560;
//            int maxHeight = 2560;
//
//            if (originalWidth > maxWidth || originalHeight > maxHeight) {
//                double widthRatio = (double) originalWidth / maxWidth;
//                double heightRatio = (double) originalHeight / maxHeight;
//                double scaleRatio = Math.max(widthRatio, heightRatio);
//
//                int newWidth = (int) (originalWidth / scaleRatio);
//                int newHeight = (int) (originalHeight / scaleRatio);
//
//                BufferedImage resizedImage = new BufferedImage(newWidth, newHeight, image.getType());
//                Graphics2D g = resizedImage.createGraphics();
//                g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
//                g.drawImage(image, 0, 0, newWidth, newHeight, null);
//                g.dispose();
//
//                ImageIO.write(resizedImage, "jpg", targetPath.toFile());
//            }
//
//            // Przeskaluj logo
//            InputStream logoInputStream = getClass().getResourceAsStream("/logo.png");
//            BufferedImage logo = ImageIO.read(logoInputStream);
//
//            int logoWidth = logo.getWidth();
//            int logoHeight = logo.getHeight();
//
//            double scale = (double) originalWidth / maxWidth;
//            int newLogoWidth = (int) (logoWidth * scale);
//            int newLogoHeight = (int) (logoHeight * scale);
//
//            BufferedImage scaledLogo = new BufferedImage(newLogoWidth, newLogoHeight, logo.getType());
//            Graphics2D logoGraphics = scaledLogo.createGraphics();
//            logoGraphics.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
//            logoGraphics.drawImage(logo, 0, 0, newLogoWidth, newLogoHeight, null);
//            logoGraphics.dispose();
//
//            int logoX = originalWidth - newLogoWidth - 10;
//            int logoY = originalHeight - newLogoHeight - 10;
//
//            BufferedImage imageWithScaledLogo = new BufferedImage(originalWidth, originalHeight, BufferedImage.TYPE_INT_RGB);
//            Graphics2D g = imageWithScaledLogo.createGraphics();
//            g.drawImage(image, 0, 0, null);
//            g.drawImage(scaledLogo, logoX, logoY, null);
//            g.dispose();
//
//            ImageIO.write(imageWithScaledLogo, "webp", targetPath.toFile());
//
//            if (advertisement.getMainPhotoUrl() == null) {
//                advertisement.setMainPhotoUrl(fileName);
//                advertisementService.saveAdvertisement(advertisement);
//            }
//        } catch (IOException e) {
//            throw new RuntimeException("Failed to save the file.", e);
//        }
//    }
}