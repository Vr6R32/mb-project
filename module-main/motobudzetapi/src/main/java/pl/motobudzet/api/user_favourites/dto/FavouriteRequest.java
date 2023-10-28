package pl.motobudzet.api.user_favourites.dto;


import lombok.*;

@Data
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class FavouriteRequest {
    private String advertisementId;
}
