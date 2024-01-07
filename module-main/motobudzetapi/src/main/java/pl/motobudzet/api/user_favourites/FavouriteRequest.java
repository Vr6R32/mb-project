package pl.motobudzet.api.user_favourites;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class FavouriteRequest {
    private String advertisementId;
}
