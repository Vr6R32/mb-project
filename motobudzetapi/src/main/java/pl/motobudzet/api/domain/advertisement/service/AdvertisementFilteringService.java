package pl.motobudzet.api.domain.advertisement.service;


import org.springframework.data.domain.Page;
import pl.motobudzet.api.dto.AdvertisementDTO;
import pl.motobudzet.api.dto.AdvertisementFilterRequest;

public interface AdvertisementFilteringService {

    Page<AdvertisementDTO> getFilteredAdvertisements(AdvertisementFilterRequest request, Integer pageNumber, String sortBy, String sortOrder);

    long getFilterResultCount(AdvertisementFilterRequest request);
}