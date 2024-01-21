package pl.motobudzet.api.utils.db_inserter;


import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import pl.motobudzet.api.advertisement.entity.Advertisement;
import pl.motobudzet.api.advertisement.model.MileageUnit;
import pl.motobudzet.api.advertisement.model.PriceUnit;
import pl.motobudzet.api.advertisement.model.Status;
import pl.motobudzet.api.advertisement.repository.AdvertisementRepository;
import pl.motobudzet.api.user_account.entity.AppUser;
import pl.motobudzet.api.user_account.model.Role;
import pl.motobudzet.api.user_account.AppUserRepository;
import pl.motobudzet.api.vehicleBrand.Brand;
import pl.motobudzet.api.vehicleBrand.BrandRepository;
import pl.motobudzet.api.vehicleModel.Model;
import pl.motobudzet.api.vehicleModel.ModelRepository;
import pl.motobudzet.api.vehicleSpec.model.DriveType;
import pl.motobudzet.api.vehicleSpec.model.EngineType;
import pl.motobudzet.api.vehicleSpec.model.FuelType;
import pl.motobudzet.api.vehicleSpec.model.TransmissionType;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
@AllArgsConstructor
public class InsertBrandsnModels {

    BrandRepository brandRepository;
    AppUserRepository userRepository;
    ModelRepository modelRepository;
    AdvertisementRepository advertisementRepository;
    PasswordEncoder passwordEncoder;


    //    @EventListener(ApplicationReadyEvent.class)
    public void fillUser() {

        Role roleUser = Role.ROLE_USER;
        Role roleAdmin = Role.ROLE_ADMIN;
        Role roleAwaitingDetails = Role.ROLE_AWAITING_DETAILS;
        AppUser admin = AppUser.builder()
                .userName("admin")
                .password(passwordEncoder.encode("admin"))
                .email("ker@hitman.pl")
                .accountEnabled(true)
                .accountNotExpired(true)
                .accountNotLocked(true)
                .credentialsNotExpired(true)
                .role(roleAdmin)
                .build();

        AppUser user = AppUser.builder()
                .userName("user")
                .password(passwordEncoder.encode("user"))
                .email("ke2@hitman.pl")
                .accountEnabled(true)
                .accountNotExpired(true)
                .accountNotLocked(true)
                .credentialsNotExpired(true)
                .role(roleUser)
                .build();

        userRepository.save(admin);
        userRepository.save(user);

        fillBrandDB(admin, user);
    }


    public void fillBrandDB(AppUser admin, AppUser user) {

        EngineType silnikRzedowy = EngineType.RZĘDOWY;
        EngineType silnikWidlasty = EngineType.WIDLASTY;
        EngineType silnikWankla = EngineType.WANKEL;

        FuelType benzyna = FuelType.BENZYNA;
        FuelType lpg = FuelType.LPG;
        FuelType diesel = FuelType.DIESEL;
        FuelType elektryczny = FuelType.ELEKTRYCZNY;

        DriveType awd = DriveType.AWD;
        DriveType fwd = DriveType.FWD;
        DriveType rwd = DriveType.RWD;

        TransmissionType manual = TransmissionType.MANUAL;
        TransmissionType automat = TransmissionType.AUTOMAT;

        Brand bmw = Brand.builder().name("BMW").modelList(new ArrayList<>()).build();
        Brand audi = Brand.builder().name("AUDI").modelList(new ArrayList<>()).build();
        Brand mercedes = Brand.builder().name("MERCEDES").modelList(new ArrayList<>()).build();
        Brand nissan = Brand.builder().name("NISSAN").modelList(new ArrayList<>()).build();
        Brand mazda = Brand.builder().name("MAZDA").modelList(new ArrayList<>()).build();
        Model e46 = Model.builder().name("E46").brand(bmw).build();
        Model e36 = Model.builder().name("E36").brand(bmw).build();
        Model e34 = Model.builder().name("E96").brand(bmw).build();
        Model e90 = Model.builder().name("E06").brand(bmw).build();
        Model z350 = Model.builder().name("Z350").brand(nissan).build();
        Model z370 = Model.builder().name("Z370").brand(nissan).build();
        Model C63 = Model.builder().name("C63").brand(mercedes).build();
        Model gelenda = Model.builder().name("G-KLASA").brand(mercedes).build();
        Model rx8 = Model.builder().name("RX-8").brand(mazda).build();
        Model rs3 = Model.builder().name("RS3").brand(audi).build();
        Model rs6 = Model.builder().name("RS6").brand(audi).build();
        Model rs8q8 = Model.builder().name("RS8Q8").brand(audi).build();
        mazda.addElement(rx8);
        nissan.addElement(z350);
        nissan.addElement(z370);
        mercedes.addElement(C63);
        mercedes.addElement(gelenda);
        audi.addElement(rs3);
        audi.addElement(rs6);
        audi.addElement(rs8q8);
        bmw.addElement(e46);
        bmw.addElement(e36);
        bmw.addElement(e34);
        bmw.addElement(e90);
        brandRepository.saveAll(List.of(audi, bmw, mazda, nissan, mercedes));
        modelRepository.saveAll(List.of(e34, e36, e46, e90, C63, gelenda, rs3, rx8, rs6, rs8q8, z350, z370));


        Advertisement ad1 = Advertisement.builder()
                .name("Audi RS3 OKAZJA !")
                .description("400hp itp")
                .brand(audi)
                .model(rs3)
                .fuelType(benzyna)
                .driveType(awd)
                .engineType(silnikRzedowy)
                .transmissionType(automat)
                .mainPhotoUrl("rs3.png")
                .mileage(42069L)
                .price(102500L)
                .engineCapacity(2497L)
                .engineHorsePower(350L)
                .firstRegistrationDate(LocalDate.of(2014, 4, 30))
                .productionDate(2016L)
                .imageUrls(List.of("rs3.png", "rs3-2.jpg"))
                .user(admin)
                .status(Status.ACTIVE)
                .build();
        Advertisement ad2 = Advertisement.builder()
                .name("Audi RS6 500HP SUPERCHARGED")
                .description("rs6 kozak mega ")
                .brand(audi)
                .model(rs6)
                .fuelType(benzyna)
                .driveType(awd)
                .engineType(silnikWidlasty)
                .transmissionType(automat)
                .mainPhotoUrl("rs6.jpg")
                .mileage(66666L)
                .price(254500L)
                .engineCapacity(4497L)
                .engineHorsePower(500L)
                .firstRegistrationDate(LocalDate.of(2013, 4, 24))
                .productionDate(2015L)
                .imageUrls(List.of("rs6.jpg", "rs6-2.jpg"))
                .user(admin)
                .status(Status.ACTIVE)
                .build();
        Advertisement ad3 = Advertisement.builder()
                .name("RSQ8 MANHART ")
                .description("description")
                .brand(audi)
                .model(rs8q8)
                .fuelType(benzyna)
                .driveType(awd)
                .engineType(silnikWidlasty)
                .transmissionType(automat)
                .mainPhotoUrl("rsq8.jpg")
                .mileage(83342L)
                .mileageUnit(MileageUnit.KM)
                .price(821000L)
                .priceUnit(PriceUnit.USD)
                .engineCapacity(4197L)
                .engineHorsePower(800L)
                .firstRegistrationDate(LocalDate.of(2006, 12, 24))
                .productionDate(2022L)
                .imageUrls(List.of("rsq8.jpg", "rsq8-2.jpg"))
                .user(admin)
                .status(Status.ACTIVE)
                .build();
        Advertisement ad4 = Advertisement.builder()
                .name("MERCEDES C63 AMG OKAZJA KOZAK IGLA")
                .description("1000hp")
                .brand(mercedes)
                .model(C63)
                .fuelType(benzyna)
                .driveType(awd)
                .engineType(silnikWidlasty)
                .transmissionType(manual)
                .mainPhotoUrl("c63.jpg")
                .mileage(32841L)
                .price(232000L)
                .engineCapacity(3897L)
                .engineHorsePower(649L)
                .firstRegistrationDate(LocalDate.of(1996, 11, 4))
                .productionDate(2012L)
                .imageUrls(List.of("c63.jpg", "c63-2.jpg"))
                .user(user)
                .status(Status.ACTIVE)
                .build();
        Advertisement ad5 = Advertisement.builder()
                .name("MERCEDES GKLASA")
                .description("gelenda")
                .brand(mercedes)
                .model(gelenda)
                .fuelType(diesel)
                .driveType(awd)
                .engineType(silnikWidlasty)
                .transmissionType(automat)
                .mainPhotoUrl("gklasa.jpg")
                .mileage(7600L)
                .price(154000L)
                .engineCapacity(4997L)
                .engineHorsePower(532L)
                .firstRegistrationDate(LocalDate.of(2019, 7, 9))
                .productionDate(2007L)
                .imageUrls(List.of("gklasa.jpg", "gklasa-2.jpg"))
                .user(user)
                .status(Status.ACTIVE)
                .build();

        Advertisement ad6 = Advertisement.builder()
                .name("MAZDA RX-8")
                .description("RX-8 WANKEL POZDRO")
                .brand(mazda)
                .model(rx8)
                .fuelType(lpg)
                .driveType(awd)
                .engineType(silnikWankla)
                .transmissionType(manual)
                .mainPhotoUrl("rx8.jpg")
                .mileage(7600L)
                .price(154000L)
                .engineCapacity(4997L)
                .engineHorsePower(532L)
                .firstRegistrationDate(LocalDate.of(2019, 7, 9))
                .productionDate(2005L)
                .imageUrls(List.of("rx8.jpg", "rx8-2.jpg"))
                .user(user)
                .status(Status.ACTIVE)
                .build();


        admin.setAdvertisements(Set.of(ad1, ad2, ad3));
        user.setAdvertisements(Set.of(ad4, ad5, ad6));

        userRepository.save(admin);
        userRepository.save(user);


    }

}
