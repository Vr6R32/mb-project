package pl.motobudzet.api.zconfiguration;


import lombok.AllArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import pl.motobudzet.api.advertisement.entity.Advertisement;
import pl.motobudzet.api.advertisement.model.MileageUnit;
import pl.motobudzet.api.advertisement.model.PriceUnit;
import pl.motobudzet.api.advertisement.repository.AdvertisementRepository;
import pl.motobudzet.api.user.entity.AppUser;
import pl.motobudzet.api.user.entity.Role;
import pl.motobudzet.api.user.repository.AppUserRepository;
import pl.motobudzet.api.user.repository.RoleRepository;
import pl.motobudzet.api.vehicleBrand.entity.Brand;
import pl.motobudzet.api.vehicleBrand.repository.BrandRepository;
import pl.motobudzet.api.vehicleModel.entity.Model;
import pl.motobudzet.api.vehicleModel.repository.ModelRepository;
import pl.motobudzet.api.vehicleSpec.entity.DriveType;
import pl.motobudzet.api.vehicleSpec.entity.EngineType;
import pl.motobudzet.api.vehicleSpec.entity.FuelType;
import pl.motobudzet.api.vehicleSpec.entity.TransmissionType;
import pl.motobudzet.api.vehicleSpec.repository.DriveTypeRepository;
import pl.motobudzet.api.vehicleSpec.repository.EngineTypeRepository;
import pl.motobudzet.api.vehicleSpec.repository.FuelTypeRepository;
import pl.motobudzet.api.vehicleSpec.repository.TransmissionTypeRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Configuration
@AllArgsConstructor
public class InsertBrandsnModels {

    BrandRepository brandRepository;
    AppUserRepository userRepository;
    RoleRepository roleRepository;
    ModelRepository modelRepository;
    AdvertisementRepository advertisementRepository;
    FuelTypeRepository fuelTypeRepository;
    TransmissionTypeRepository transmissionTypeRepository;
    DriveTypeRepository driveTypeRepository;
    EngineTypeRepository engineTypeRepository;
    PasswordEncoder passwordEncoder;


//    @EventListener(ApplicationReadyEvent.class)
    public void fillUser(){

        Role roleUser = Role.builder().name("ROLE_USER").build();
        Role roleAdmin = Role.builder().name("ROLE_ADMIN").build();
        AppUser admin = AppUser.builder()
                .userName("admin")
                .password(passwordEncoder.encode("admin"))
                .email("ker@hitman.pl")
                .accountEnabled(true)
                .accountNotExpired(true)
                .accountNotLocked(true)
                .credentialsNotExpired(true)
                .roles(List.of(roleAdmin))
                .build();

        AppUser user = AppUser.builder()
                .userName("user")
                .password(passwordEncoder.encode("user"))
                .email("ke2@hitman.pl")
                .accountEnabled(true)
                .accountNotExpired(true)
                .accountNotLocked(true)
                .credentialsNotExpired(true)
                .roles(List.of(roleUser))
                .build();

            userRepository.save(admin);
            userRepository.save(user);

        fillBrandDB(admin,user);
    }



    public void fillBrandDB(AppUser admin,AppUser user){

        EngineType silnikRzedowy = EngineType.builder().name("Rzedowy").build();
        EngineType silnikWidlasty = EngineType.builder().name("Widlasty").build();
        EngineType silnikWankla = EngineType.builder().name("Wankel").build();

        FuelType benzyna = FuelType.builder().name("BENZYNA").build();
        FuelType lpg = FuelType.builder().name("LPG").build();
        FuelType diesel = FuelType.builder().name("DIESEL").build();
        FuelType elektryczny = FuelType.builder().name("ELEKTRYCZNY").build();

        DriveType awd = DriveType.builder().name("AWD").build();
        DriveType fwd = DriveType.builder().name("RWD").build();
        DriveType rwd = DriveType.builder().name("FWD").build();

        TransmissionType manual = TransmissionType.builder().name("Manual").build();
        TransmissionType automat = TransmissionType.builder().name("Automat").build();

        transmissionTypeRepository.saveAll(List.of(manual, automat));
        engineTypeRepository.saveAll(List.of(silnikRzedowy, silnikWidlasty, silnikWankla));
        fuelTypeRepository.saveAll(List.of(benzyna, lpg, diesel, elektryczny));
        driveTypeRepository.saveAll(List.of(awd, fwd, rwd));

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
        modelRepository.saveAll(List.of(e34,e36,e46,e90,C63,gelenda,rs3,rx8,rs6,rs8q8,z350,z370));

        brandRepository.saveAll(List.of(audi,bmw,mazda,nissan,mercedes));


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
                .firstRegistrationDate(LocalDate.of(2014,4,30))
                .productionDate(2016L)
                .creationTime(LocalDateTime.now().minusDays(2).minusHours(3))
                .imageUrls(List.of("rs3.png","rs3-2.jpg"))
                .user(admin)
                .isVerified(true)
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
                .firstRegistrationDate(LocalDate.of(2013,4,24))
                .productionDate(2015L)
                .creationTime(LocalDateTime.now().minusDays(1).minusHours(4))
                .imageUrls(List.of("rs6.jpg","rs6-2.jpg"))
                .user(admin)
                .isVerified(true)
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
                .firstRegistrationDate(LocalDate.of(2006,12,24))
                .productionDate(2022L)
                .creationTime(LocalDateTime.now().minusDays(5).minusHours(10))
                .imageUrls(List.of("rsq8.jpg","rsq8-2.jpg"))
                .user(admin)
                .isVerified(true)
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
                .firstRegistrationDate(LocalDate.of(1996,11,4))
                .productionDate(2012L)
                .creationTime(LocalDateTime.now().minusDays(12).minusHours(30))
                .imageUrls(List.of("c63.jpg","c63-2.jpg"))
                .user(user)
                .isVerified(true)
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
                .firstRegistrationDate(LocalDate.of(2019,7,9))
                .productionDate(2007L)
                .creationTime(LocalDateTime.now().minusDays(20).minusHours(13))
                .imageUrls(List.of("gklasa.jpg","gklasa-2.jpg"))
                .user(user)
                .isVerified(true)
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
                .firstRegistrationDate(LocalDate.of(2019,7,9))
                .productionDate(2005L)
                .creationTime(LocalDateTime.now().minusDays(20).minusHours(13))
                .imageUrls(List.of("rx8.jpg","rx8-2.jpg"))
                .user(user)
                .isVerified(true)
                .build();


        admin.setAdvertisements(List.of(ad1,ad2,ad3));
        user.setAdvertisements(List.of(ad4,ad5,ad6));

        userRepository.save(admin);
        userRepository.save(user);



    }

}
