package pl.motobudzet.api.adapter.facade;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import pl.motobudzet.api.dto.AdvertisementDTO;
import pl.motobudzet.api.dto.AdvertisementFilterRequest;
import pl.motobudzet.api.dto.AdvertisementRequest;
import pl.motobudzet.api.domain.advertisement.entity.Advertisement;

import pl.motobudzet.api.domain.advertisement.service.AdvertisementFilteringService;
import pl.motobudzet.api.domain.advertisement.service.AdvertisementMetaDataService;
import pl.motobudzet.api.domain.advertisement.service.AdvertisementService;
import pl.motobudzet.api.domain.user.AppUser;
import pl.motobudzet.api.infrastructure.thymeleaf.MetaDataDTO;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
public class AdvertisementFacade {

    private final AdvertisementService advertisementService;
    private final AdvertisementFilteringService advertisementFilteringService;
    private final AdvertisementMetaDataService advertisementMetaDataService;

    public AdvertisementDTO getAdvertisementById(UUID uuid) {
        return advertisementService.findOneByIdWithFetch(uuid);
    }

    public Advertisement getAdvertisementEntity(UUID advertisementId) {
        return advertisementService.getAdvertisement(advertisementId);
    }

    public List<AdvertisementDTO> getUserAdvertisements(AppUser loggedUser) {
        return advertisementService.getAllUserAdvertisements(loggedUser);
    }

    public List<AdvertisementDTO> getAdvertisementsToVerify(Integer pageNumber) {
        return advertisementService.findAllAdvertisementsToVerify(pageNumber);
    }

    public List<AdvertisementDTO> getFewLastUploadedAdvertisements(Integer pageNumber, Integer pageSize) {
        return advertisementService.getFewLastUploadedAdvertisements(pageNumber, pageSize);
    }

    public long getFilterResultCount(AdvertisementFilterRequest request) {
        return advertisementFilteringService.getFilterResultCount(request);
    }

    public Page<AdvertisementDTO> getFilteredAdvertisements(AdvertisementFilterRequest request, Integer pageNumber, String sortBy, String sortOrder) {
        return advertisementFilteringService.getFilteredAdvertisements(request, pageNumber, sortBy, sortOrder);
    }

    public ResponseEntity<String> createAdvertisement(AdvertisementRequest request, AppUser user, List<MultipartFile> files) {
        return advertisementService.createAdvertisement(request, user, files);
    }

    public ResponseEntity<String> editAdvertisement(UUID advertisementId, AdvertisementRequest request, AppUser loggedUser, List<MultipartFile> files) {
        return advertisementService.editAdvertisement(advertisementId, request, loggedUser, files);
    }

    public MetaDataDTO getAdvertisementMetaDataById(UUID uuid) {
        return advertisementMetaDataService.getMetaDataForAdvertisementById(uuid);
    }

    public String verifyAdvertisement(UUID id, AppUser loggedUser) {
        return advertisementService.verifyAndEnableAdvertisement(id, loggedUser);
    }

    public int rejectAdvertisement(UUID id, AppUser loggedUser) {
        return advertisementService.rejectAdvertisement(id, loggedUser);
    }

    @Transactional
    public int deleteAdvertisement(UUID id, AppUser loggedUser) {
        return advertisementService.deleteAdvertisement(id, loggedUser);
    }

}
