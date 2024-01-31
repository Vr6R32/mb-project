package pl.motobudzet.api.app_user.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.RandomStringUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import pl.motobudzet.api.domain.user.service.RegistrationService;
import pl.motobudzet.api.infrastructure.mailing.SpringMailSenderService;
import pl.motobudzet.api.domain.user.AppUserRepository;
import pl.motobudzet.api.domain.user.dto.NewPasswordRequest;
import pl.motobudzet.api.domain.user.dto.RegistrationRequest;
import pl.motobudzet.api.domain.user.dto.ResetPasswordRequest;
import pl.motobudzet.api.domain.user.entity.AppUser;
import pl.motobudzet.api.infrastructure.configuration.securty_jwt.JwtService;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertAll;
import static org.mockito.BDDMockito.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;

@ExtendWith(MockitoExtension.class)
class RegistrationServiceTest {

    @Mock
    AppUserRepository userRepository;
    @Mock
    PasswordEncoder passwordEncoder;
    @Mock
    SpringMailSenderService mailService;
    @Mock
    HttpServletRequest request;
    @Mock
    HttpServletResponse response;
    @Mock
    JwtService jwtService;

    @Captor
    private ArgumentCaptor<AppUser> appUserArgumentCaptor;

    RegistrationService registrationService;

    @BeforeEach
    void setUp() {
        registrationService = new RegistrationService(userRepository,passwordEncoder, mailService,jwtService);
    }

    @Test
    void should_register_user_successfully_happy_path(){

        //given
        RegistrationRequest request = RegistrationRequest.builder().userName("mockeymock").password("mockypass").email("mockey@mock.pl").build();
        when(userRepository.checkUsernameAndEmailAvailability(request.getUserName(),request.getEmail())).thenReturn("Both username and email are available");
        //when
        registrationService.register(request);
        //then
        then(userRepository).should().saveAndFlush(appUserArgumentCaptor.capture());

        AppUser savedUser = appUserArgumentCaptor.getValue();

        verify(mailService, times(1)).sendRegisterActivationNotificationHtml(savedUser);

        assertThat(savedUser)
                .hasFieldOrPropertyWithValue("userName", "mockeymock")
                .hasFieldOrPropertyWithValue("email", "mockey@mock.pl");
    }

    @Test
    void should_not_register_user_when_username_already_exists(){
        //given
        RegistrationRequest request = RegistrationRequest.builder().userName("mockeymock").password("mockypass").email("mockey@mock.pl").build();
        when(userRepository.checkUsernameAndEmailAvailability(request.getUserName(),request.getEmail())).thenReturn("Username is already taken");
        //when
        registrationService.register(request);
        //then
        then(userRepository).should(never()).saveAndFlush(any());
    }

    @Test
    void should_not_register_user_when_email_already_exists(){
        //given
        RegistrationRequest request = RegistrationRequest.builder().userName("mockeymock").password("mockypass").email("mockey@mock.pl").build();
        when(userRepository.checkUsernameAndEmailAvailability(request.getUserName(),request.getEmail())).thenReturn("Email is already taken");
        //when
        registrationService.register(request);
        //then
        then(userRepository).should(never()).saveAndFlush(any());
    }

    @Test
    void should_confirm_and_enable_account_when_proper_register_code() throws IOException {
        //given
        String registerCode = "123456789";
        AppUser user = AppUser.builder().registerCode(registerCode).accountEnabled(false).build();
        when(userRepository.findUserByRegistrationCode(registerCode)).thenReturn(Optional.of(user));

        //when
        registrationService.confirmEmail(registerCode,response,request);

        //then
        then(userRepository).should().saveAndFlush(appUserArgumentCaptor.capture());
        AppUser savedUser = appUserArgumentCaptor.getValue();

        then(jwtService).should().authenticate(appUserArgumentCaptor.capture(),any(HttpServletResponse.class));

        assertThat(savedUser)
                .hasFieldOrPropertyWithValue("accountEnabled", true)
                .hasFieldOrPropertyWithValue("registerCode","123456789");

        verify(response, times(1)).sendRedirect(contains("/user/details?activation=true"));

    }

    @Test
    void should_not_confirm_and_enable_account_when_bad_register_code() {
        //given
        String registerCode = "invalid_code";
        when(userRepository.findUserByRegistrationCode(registerCode)).thenThrow(new IllegalArgumentException("WRONG_ACTIVATION_CODE"));

        //when
        assertThatThrownBy(() -> registrationService.confirmEmail(registerCode, response, request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("WRONG_ACTIVATION_CODE");


//        Throwable thrown = catchThrowable(() -> registrationService.confirmEmail(registerCode, response, request));
//        assertThat(thrown)
//                .isInstanceOf(IllegalArgumentException.class)
//                .hasMessageContaining("WRONG_ACTIVATION_CODE");
        //then
        verify(userRepository,never()).saveAndFlush(any());
    }
    @Test
    void should_not_confirm_and_enable_account_when_account_is_already_enabled() throws IOException {

        //given
        String registerCode = "123456789";
        AppUser optionalUser = AppUser.builder().registerCode(registerCode).accountEnabled(true).build();
        when(userRepository.findUserByRegistrationCode(registerCode)).thenReturn(Optional.of(optionalUser));

        //when
        registrationService.confirmEmail(registerCode, response, request);

        //then
        verify(userRepository,never()).saveAndFlush(any());
        verify(response, times(1)).sendRedirect(startsWith("/"));
    }

    @Test
    void should_generatePasswordResetCode_and_sendNotification() {

        // given
        String email = "mockey@mock.pl";
        ResetPasswordRequest resetPasswordRequest = ResetPasswordRequest.builder().email(email).build();
        AppUser mockUser = AppUser.builder().email(email).build();
        LocalDateTime expectedDateTime = LocalDateTime.now().plusDays(1).truncatedTo(ChronoUnit.MINUTES);

        given(userRepository.insertResetPasswordCode(any(String.class), any(LocalDateTime.class), eq(resetPasswordRequest.getEmail())))
                .willReturn(1);

        given(userRepository.findUserByResetPasswordCode(any(String.class)))
                .willReturn(Optional.of(mockUser));

        // when
        int result = registrationService.generatePasswordResetCode(resetPasswordRequest);

        // then
        assertThat(result).isEqualTo(1);

        ArgumentCaptor<String> resetCodeCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<LocalDateTime> dateTimeCaptor = ArgumentCaptor.forClass(LocalDateTime.class);

        verify(userRepository).insertResetPasswordCode(resetCodeCaptor.capture(), dateTimeCaptor.capture(), eq(resetPasswordRequest.getEmail()));

        String resetCodeValue = resetCodeCaptor.getValue();
        LocalDateTime codeDateValidUntil = dateTimeCaptor.getValue().truncatedTo(ChronoUnit.MINUTES);

        assertThat(resetCodeValue).hasSize(30);
        assertThat(codeDateValidUntil).isEqualTo(expectedDateTime);
        verify(mailService).sendResetPasswordNotificationCodeLink(mockUser);

    }

    @Test
    void should_change_user_password_when_correct_and_valid_reset_code(){

        //given
        String resetCode = RandomStringUtils.random(30);
        NewPasswordRequest passwordRequest = NewPasswordRequest.builder().password("test123").passwordRepeat("test123").resetCode(resetCode).build();
        AppUser user = AppUser.builder().resetPasswordCode(resetCode).resetPasswordCodeExpiration(LocalDateTime.now().plusHours(2)).build();
        String encodedPassword = "encoded" + passwordRequest.getPassword();
        given(userRepository.findUserByResetPasswordCode(resetCode)).willReturn(Optional.of(user));
        given(passwordEncoder.encode(passwordRequest.getPassword())).willReturn(encodedPassword);

        //when
        registrationService.changeUserPassword(passwordRequest);

        //then
        ArgumentCaptor<String> resetCodeCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> newPassword = ArgumentCaptor.forClass(String.class);

        verify(userRepository).insertNewUserPassword(newPassword.capture(),resetCodeCaptor.capture());
        assertAll(
                () -> assertThat(newPassword.getValue()).isEqualTo(encodedPassword),
                () -> assertThat(resetCodeCaptor.getValue()).isEqualTo(passwordRequest.getResetCode())
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
        int result = registrationService.changeUserPassword(passwordRequest);
        //then
        assertThat(result).isZero();
    }


    @Test
    void should_not_change_user_password_when_passwords_doesnt_match(){

        //given
        String resetCode = RandomStringUtils.random(30);
        NewPasswordRequest passwordRequest = NewPasswordRequest.builder().password("test123").passwordRepeat("123123").resetCode(resetCode).build();
        //when
        int result = registrationService.changeUserPassword(passwordRequest);
        //then
        assertThat(result).isZero();
    }
}