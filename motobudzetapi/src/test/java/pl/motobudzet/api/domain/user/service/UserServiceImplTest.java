package pl.motobudzet.api.domain.user.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.RandomStringUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import pl.motobudzet.api.adapter.facade.EmailManagerFacade;
import pl.motobudzet.api.adapter.facade.LocationFacade;
import pl.motobudzet.api.domain.location.City;
import pl.motobudzet.api.domain.location.CityState;
import pl.motobudzet.api.domain.user.UserDoesntExistException;
import pl.motobudzet.api.dto.AppUserDTO;
import pl.motobudzet.api.dto.NewPasswordRequest;
import pl.motobudzet.api.dto.ResetPasswordRequest;
import pl.motobudzet.api.dto.UserDetailsRequest;
import pl.motobudzet.api.domain.user.AppUser;
import pl.motobudzet.api.model.Role;
import pl.motobudzet.api.infrastructure.configuration.security.JwtService;
import pl.motobudzet.api.infrastructure.mapper.UserMapper;
import pl.motobudzet.api.model.EmailNotificationRequest;
import pl.motobudzet.api.model.EmailType;
import pl.motobudzet.api.persistance.AppUserRepository;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    HttpServletRequest httpServletRequest;
    @Mock
    HttpServletResponse response;
    @Mock
    EmailManagerFacade mailService;
    @Mock
    LocationFacade locationFacade;
    @Mock
    AppUserRepository userRepository;
    @Mock
    PasswordEncoder passwordEncoder;
    @Mock
    JwtService jwtService;

    UserService userServiceImpl;

    @BeforeEach
    void setUp() {
        userServiceImpl = FactoryUserService.createUserService(userRepository, passwordEncoder, mailService, locationFacade, jwtService);
    }


    @Test
    void shouldReturnUserDetailsWhenUserExists() {
        // Given
        String username = "mockey32";
        CityState cityState = CityState.builder().id(1L).name("cityState").cities(List.of()).build();
        City city = City.builder().name("city").id(1L).cityState(cityState).build();
        AppUser user = AppUser.builder().userName(username).id(1L).name("mockey").surname("mock").email("mockey@mock.pl").city(city).build();
        AppUserDTO expectedDTO = UserMapper.mapUserEntityToDTO(user);

        given(userRepository.findUserDetailsByName(username)).willReturn(Optional.of(user));

        // When

        AppUserDTO resultDTO = userServiceImpl.getUserDetails(username);

        // Then
        assertThat(resultDTO).isEqualTo(expectedDTO);

    }

    @Test
    void should_Throw_Exception_When_User_Does_Not_Exist() {
        // Given
        String userName = "nonExistingUser";
        given(userRepository.findUserDetailsByName(userName)).willReturn(Optional.empty());

        // When & Then
        assertThrows(UserDoesntExistException.class, () -> {
            userServiceImpl.getUserDetails(userName);
        });
    }


    @Test
    void should_Update_First_User_Details_And_Return_RedirectUrl() {
        // Given
        UserDetailsRequest request = new UserDetailsRequest("city", "SomeState", "123456789", "mockey", "mock");
        AppUser loggedUser = AppUser.builder().id(1L).email("mockey@mock.pl").build();

        City mockCity = City.builder().id(1L).name("city").build();
        given(locationFacade.getCityByNameAndState(anyString(), anyString())).willReturn(mockCity);

        // When
        ResponseEntity<?> result = userServiceImpl.updateFirstUserDetails(request, loggedUser, response, httpServletRequest);

        // Then
        verify(userRepository).insertUserFirstDetails(eq(mockCity.getId()), eq("mockey"), eq("mock"), eq("123456789"), eq(Role.ROLE_USER), eq(loggedUser.getEmail()));
        verify(jwtService).authenticate(eq(loggedUser), eq(response));
        assertThat(loggedUser.getRole()).isEqualTo(Role.ROLE_USER);

        Map<String, String> body = (Map<String, String>) result.getBody();
        assertThat(body).containsKey("redirectUrl");
        String redirectUrl = body.get("redirectUrl");
        assertThat(redirectUrl).contains("?activation=true");
    }



    @Test
    void should_generatePasswordResetCode_and_sendNotification() {

        // given
        String email = "mockey@mock.pl";
        ResetPasswordRequest resetPasswordRequest = ResetPasswordRequest.builder().email(email).build();
        AppUser mockUser = AppUser.builder().email(email).build();
        LocalDateTime expectedDateTime = LocalDateTime.now().plusDays(1).truncatedTo(ChronoUnit.MINUTES);

        given(userRepository.insertResetPasswordCode(any(String.class), any(LocalDateTime.class), eq(resetPasswordRequest.email())))
                .willReturn(1);

        given(userRepository.findUserByResetPasswordCode(any(String.class)))
                .willReturn(Optional.of(mockUser));

        // when
        int result = userServiceImpl.generatePasswordResetCode(resetPasswordRequest);

        // then
        assertThat(result).isEqualTo(1);

        ArgumentCaptor<String> resetCodeCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<LocalDateTime> dateTimeCaptor = ArgumentCaptor.forClass(LocalDateTime.class);

        verify(userRepository).insertResetPasswordCode(resetCodeCaptor.capture(), dateTimeCaptor.capture(), eq(resetPasswordRequest.email()));

        String resetCodeValue = resetCodeCaptor.getValue();
        LocalDateTime codeDateValidUntil = dateTimeCaptor.getValue().truncatedTo(ChronoUnit.MINUTES);

        assertThat(resetCodeValue).hasSize(30);
        assertThat(codeDateValidUntil).isEqualTo(expectedDateTime);
        verify(mailService).publishEmailNotificationEvent(EmailNotificationRequest.builder().type(EmailType.RESET_PASS_CODE).receiverEmail(List.of(email)).build());

    }

    @Test
    void should_change_user_password_when_correct_and_valid_reset_code(){

        //given
        String resetCode = RandomStringUtils.random(30);
        NewPasswordRequest passwordRequest = NewPasswordRequest.builder().password("test123").passwordRepeat("test123").resetCode(resetCode).build();
        AppUser user = AppUser.builder().resetPasswordCode(resetCode).resetPasswordCodeExpiration(LocalDateTime.now().plusHours(2)).build();
        String encodedPassword = "encoded" + passwordRequest.password();
        given(userRepository.findUserByResetPasswordCode(resetCode)).willReturn(Optional.of(user));
        given(passwordEncoder.encode(passwordRequest.password())).willReturn(encodedPassword);

        //when
        userServiceImpl.changeUserPassword(passwordRequest);

        //then
        ArgumentCaptor<String> resetCodeCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> newPassword = ArgumentCaptor.forClass(String.class);

        verify(userRepository).insertNewUserPassword(newPassword.capture(),resetCodeCaptor.capture());
        assertAll(
                () -> assertThat(newPassword.getValue()).isEqualTo(encodedPassword),
                () -> assertThat(resetCodeCaptor.getValue()).isEqualTo(passwordRequest.resetCode())
        );

    }

    @Test
    void should_not_change_user_password_when_reset_code_not_valid(){

        //given
        String resetCode = RandomStringUtils.random(30);
        NewPasswordRequest passwordRequest = NewPasswordRequest.builder().password("test123").passwordRepeat("test123").resetCode(resetCode).build();
        AppUser user = AppUser.builder().resetPasswordCode(resetCode).resetPasswordCodeExpiration(LocalDateTime.now().minusHours(27)).build();

        given(userRepository.findUserByResetPasswordCode(resetCode)).willReturn(Optional.of(user));
        //when
        int result = userServiceImpl.changeUserPassword(passwordRequest);
        //then
        assertThat(result).isZero();
    }


    @Test
    void should_not_change_user_password_when_passwords_doesnt_match(){

        //given
        String resetCode = RandomStringUtils.random(30);
        NewPasswordRequest passwordRequest = NewPasswordRequest.builder().password("test123").passwordRepeat("123123").resetCode(resetCode).build();
        //when
        int result = userServiceImpl.changeUserPassword(passwordRequest);
        //then
        assertThat(result).isZero();
    }

}