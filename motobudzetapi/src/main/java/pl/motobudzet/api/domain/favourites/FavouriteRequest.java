package pl.motobudzet.api.domain.favourites;

import lombok.Builder;


@Builder
public record FavouriteRequest(String advertisementId) {
}
