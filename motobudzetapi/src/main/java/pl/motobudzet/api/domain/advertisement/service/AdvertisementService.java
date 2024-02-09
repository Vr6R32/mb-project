package pl.motobudzet.api.domain.advertisement.service;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import pl.motobudzet.api.dto.AdvertisementDTO;
import pl.motobudzet.api.dto.AdvertisementRequest;
import pl.motobudzet.api.domain.advertisement.entity.Advertisement;
import pl.motobudzet.api.domain.user.entity.AppUser;

import java.util.List;
import java.util.UUID;

public interface AdvertisementService {

    AdvertisementDTO findOneByIdWithFetch(UUID uuid);

    List<AdvertisementDTO> getFewLastUploadedAdvertisements(Integer pageNumber, Integer pageSize);

    ResponseEntity<String> createAdvertisement(AdvertisementRequest request, AppUser user, List<MultipartFile> files);

    ResponseEntity<String> editAdvertisement(UUID advertisementId, AdvertisementRequest request, String loggedUser, List<MultipartFile> files);

    List<AdvertisementDTO> findAllAdvertisementsToVerify(Integer pageNumber);

    String verifyAndEnableAdvertisement(UUID id);

    Advertisement getAdvertisement(UUID advertisementId);

    List<AdvertisementDTO> getAllUserAdvertisements(AppUser loggedUser);

    int deleteUserAdvertisement(UUID id, String loggedUser);

    int rejectAdvertisement(UUID id);
}