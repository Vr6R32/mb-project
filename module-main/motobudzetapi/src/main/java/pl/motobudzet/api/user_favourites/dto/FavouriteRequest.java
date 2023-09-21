package pl.motobudzet.api.user_favourites.dto;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FavouriteRequest {
    String userName;
    String advertisementId;
}
