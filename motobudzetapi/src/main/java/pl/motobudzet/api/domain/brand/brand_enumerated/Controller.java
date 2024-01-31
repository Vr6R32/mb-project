package pl.motobudzet.api.domain.brand.brand_enumerated;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/generic/brands/and/models/test")
public class Controller {

    @GetMapping
    public void test(){
//        Brand brandAndModel = Brand.findBrandAndModel("audi", "a3");
//        System.out.println(brandAndModel);
        TestEntity build = TestEntity.builder()
                .brand(Brand.BMW)
                .model(ModelAUDI.A4).build();

        Brand.printAllModels();

        TestEntity build1 = TestEntity.builder().brand(Brand.ABARTH).model(ModelABARTH.M124).build();
        System.out.println(build1);
        System.out.println(build1.getModel().getModelName());

        System.out.println(build);
        System.out.println(build.getModel().getModelName());
    }

}

