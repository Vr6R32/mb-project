package pl.motobudzet.api.utils.data_extract;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import pl.motobudzet.api.domain.brand.BrandRepository;

import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
public class ModelBrandGenerationExtract {

    private final BrandRepository brandRepository;

    public void extractBrands() {

        try {
            String content = new String(Files.readAllBytes(Paths.get("C:\\moto-budzet\\module-main\\motobudzetapi\\src\\main\\java\\pl\\motobudzet\\api\\utils\\dataextract\\brands.txt")));
            String patternStr = "<span class=\"ooa-micpln er34gjf0\">([^<]+)</span>";
            Pattern pattern = Pattern.compile(patternStr);
            Matcher matcher = pattern.matcher(content);

            while (matcher.find()) {
                String brandWithCount = matcher.group(1).trim();
                String cleanBrand = brandWithCount.replaceAll(" \\(\\d+\\)", "");
//                brandList.add(cleanBrand);
            }
//            System.out.println(brandList.size());
//            System.out.println(brandList.toString());

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    //    @EventListener(ApplicationReadyEvent.class)
    public void extractBrandsAndCountsToMap() {
        Map<String, Integer> brandMap = new HashMap<>();

        try {
            String content = new String(Files.readAllBytes(Paths.get("C:\\moto-budzet\\module-main\\motobudzetapi\\src\\main\\java\\pl\\motobudzet\\api\\utils\\dataextract\\brands.txt")));
            String patternStr = "<span class=\"ooa-micpln er34gjf0\">([^<]+)</span>";
            Pattern pattern = Pattern.compile(patternStr);
            Matcher matcher = pattern.matcher(content);

            while (matcher.find()) {
                String brandWithCount = matcher.group(1).trim();

                Pattern countPattern = Pattern.compile("\\((\\d+)\\)");
                Matcher countMatcher = countPattern.matcher(brandWithCount);

                if (countMatcher.find()) {
                    Integer count = Integer.parseInt(countMatcher.group(1));
                    String brandName = brandWithCount.replace(countMatcher.group(0), "").trim();
                    brandMap.put(brandName, count);
                }
            }

            List<String> brandNamesList = extractBrandsToStringList(brandMap);

            extractBrandsTxtFilesWithModelNames("C:\\moto-budzet\\module-main\\motobudzetapi\\src\\main\\java\\pl\\motobudzet\\api\\utils\\dataextract\\models", brandNamesList);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void extractBrandsTxtFilesWithModelNames(String folderPath, List<String> brandNamesList) throws IOException {
        Path path = Paths.get(folderPath);
        brandNamesList.sort(Comparator.naturalOrder());
        System.out.println(brandNamesList.size());
        System.out.println(brandNamesList);
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(path, "*.txt")) {
            for (Path entry : stream) {
                String fileNameWithoutExtension = entry.getFileName().toString().replace(".txt", "").replace(" models", "");
                if (brandNamesList.contains(fileNameWithoutExtension.toLowerCase())) {

                    List<String> models = extractModelsFromFile(entry.toString());
                    models.remove("Wybierz");
                    models.remove("Inny");
                    models.add("Inny");
//                    buildAndSaveEntities(brandNamesList, fileNameWithoutExtension, models);
                }
            }
        }
    }

//    private void buildAndSaveEntities(List<String> brandNamesList, String fileNameWithoutExtension, List<String> models) {
//        String brand = brandNamesList.stream().filter(s -> s.contains(fileNameWithoutExtension)).findFirst().orElse(null);
//        Brand brandEntity = Brand.builder().name(brand.toUpperCase()).modelList(new ArrayList<>()).build();
//        models.forEach(modelName -> {
//            Model modelEntity = Model.builder().brand(brandEntity).name(modelName.toUpperCase()).build();
//            brandEntity.addElement(modelEntity);
//        });
//        brandRepository.save(brandEntity);
//    }

    public List<String> extractModelsFromFile(String filePath) throws IOException {
        List<String> modelList = new ArrayList<>();
        String content = new String(Files.readAllBytes(Paths.get(filePath)));

        String patternStr = "<span class=\"ooa-micpln er34gjf0\">([^<]+)</span>";
        Pattern pattern = Pattern.compile(patternStr);
        Matcher matcher = pattern.matcher(content);

        while (matcher.find()) {
            String modelWithCount = matcher.group(1).trim();
            String modelName = modelWithCount.replaceAll(" \\(\\d+\\)$", "").trim();
            modelList.add(modelName);
        }

        return modelList;
    }

    private List<String> extractBrandsToStringList(Map<String, Integer> brandMap) {
        List<String> brandNames = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : brandMap.entrySet()) {
            if (entry.getValue() > 0) {
                brandNames.add(entry.getKey().toLowerCase());
            }
        }
        return brandNames;
    }
}
