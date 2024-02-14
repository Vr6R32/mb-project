package pl.motobudzet.api.dto;


import lombok.*;

@Builder
public record UserDetailsRequest(String city, String cityState, String phoneNumber, String name, String surname) {
}
