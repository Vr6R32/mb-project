package pl.motobudzet.api.domain.user.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import pl.motobudzet.api.dto.AppUserDTO;
import pl.motobudzet.api.dto.NewPasswordRequest;
import pl.motobudzet.api.dto.ResetPasswordRequest;
import pl.motobudzet.api.dto.UserDetailsRequest;
import pl.motobudzet.api.domain.user.AppUser;

public interface UserService {
    int changeUserPassword(NewPasswordRequest request);

    int generatePasswordResetCode(ResetPasswordRequest request);

    ResponseEntity<?> updateFirstUserDetails(UserDetailsRequest request, AppUser loggedUser, HttpServletResponse response, HttpServletRequest httpServletRequest);

    AppUserDTO getUserDetails(String userName);
}
