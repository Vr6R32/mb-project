package pl.motobudzet.api.domain.brand.brand_enumerated;

public class BrandModelService {
    public void setBrandAndModel(TestEntity entity, String brandName, String modelName) {
        Brand brand = Brand.findBrandAndModel(brandName, modelName);
        if (brand != null) {
            switch (brand) {
                case AUDI -> entity.setModel(ModelAUDI.valueOf(modelName.toUpperCase()));
                case BMW -> entity.setModel(ModelBMW.valueOf(modelName.toUpperCase()));
            }
            entity.setBrand(brand);
        }
    }

}
