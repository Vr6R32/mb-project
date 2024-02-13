package pl.motobudzet.api.domain.advertisement.service;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import pl.motobudzet.api.domain.advertisement.entity.Advertisement;
import pl.motobudzet.api.domain.user.entity.AppUser;
import pl.motobudzet.api.dto.AdvertisementDTO;
import pl.motobudzet.api.dto.AdvertisementRequest;

import java.util.List;
import java.util.UUID;

public interface AdvertisementService {

    AdvertisementDTO findOneByIdWithFetch(UUID uuid);

    List<AdvertisementDTO> getFewLastUploadedAdvertisements(Integer pageNumber, Integer pageSize);

    ResponseEntity<String> createAdvertisement(AdvertisementRequest request, AppUser user, List<MultipartFile> files);

    ResponseEntity<String> editAdvertisement(UUID advertisementId, AdvertisementRequest request, AppUser loggedUser, List<MultipartFile> files);

    List<AdvertisementDTO> findAllAdvertisementsToVerify(Integer pageNumber);

    String verifyAndEnableAdvertisement(UUID id, AppUser loggedUser);

    Advertisement getAdvertisement(UUID advertisementId);

    List<AdvertisementDTO> getAllUserAdvertisements(AppUser loggedUser);

    int deleteAdvertisement(UUID id, AppUser loggedUser);

    int rejectAdvertisement(UUID id, AppUser loggedUser);
}