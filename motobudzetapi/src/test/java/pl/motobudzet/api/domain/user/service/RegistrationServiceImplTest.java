package pl.motobudzet.api.domain.user.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import pl.motobudzet.api.adapter.facade.EmailManagerFacade;
import pl.motobudzet.api.model.EmailNotificationRequest;
import pl.motobudzet.api.model.EmailType;
import pl.motobudzet.api.persistance.AppUserRepository;
import pl.motobudzet.api.domain.user.dto.RegistrationRequest;
import pl.motobudzet.api.domain.user.entity.AppUser;
import pl.motobudzet.api.infrastructure.configuration.security.JwtService;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;

@ExtendWith(MockitoExtension.class)
class RegistrationServiceImplTest {

    @Mock
    AppUserRepository userRepository;
    @Mock
    PasswordEncoder passwordEncoder;
    @Mock
    EmailManagerFacade mailService;
    @Mock
    HttpServletRequest request;
    @Mock
    HttpServletResponse response;
    @Mock
    JwtService jwtService;

    @Captor
    private ArgumentCaptor<AppUser> appUserArgumentCaptor;

    RegistrationService registrationServiceImpl;

    @BeforeEach
    void setUp() {
        registrationServiceImpl = FactoryUserService.createRegistrationService(userRepository, passwordEncoder, mailService, jwtService);
    }

    @Test
    void should_register_user_successfully_happy_path(){

        //given
        RegistrationRequest request = RegistrationRequest.builder().userName("mockeymock").password("mockypass").email("mockey@mock.pl").build();
        when(userRepository.checkUsernameAndEmailAvailability(request.userName(),request.email())).thenReturn("Both username and email are available");
        //when
        registrationServiceImpl.register(request);
        //then
        then(userRepository).should().save(appUserArgumentCaptor.capture());

        AppUser savedUser = appUserArgumentCaptor.getValue();

        EmailNotificationRequest emailNotificationRequest = EmailNotificationRequest.builder().type(EmailType.REGISTER_ACTIVATION).userName(savedUser.getUsername()).userRegisterCode(savedUser.getRegisterCode()).receiverEmail(List.of(savedUser.getEmail())).build();


        verify(mailService, times(1)).publishEmailNotificationEvent(emailNotificationRequest);


        assertThat(savedUser)
                .hasFieldOrPropertyWithValue("userName", "mockeymock")
                .hasFieldOrPropertyWithValue("email", "mockey@mock.pl");
    }

    @Test
    void should_not_register_user_when_username_already_exists(){
        //given
        RegistrationRequest request = RegistrationRequest.builder().userName("mockeymock").password("mockypass").email("mockey@mock.pl").build();
        when(userRepository.checkUsernameAndEmailAvailability(request.userName(),request.email())).thenReturn("Username is already taken");
        //when
        registrationServiceImpl.register(request);
        //then
        then(userRepository).should(never()).saveAndFlush(any());
    }

    @Test
    void should_not_register_user_when_email_already_exists(){
        //given
        RegistrationRequest request = RegistrationRequest.builder().userName("mockeymock").password("mockypass").email("mockey@mock.pl").build();
        when(userRepository.checkUsernameAndEmailAvailability(request.userName(),request.email())).thenReturn("Email is already taken");
        //when
        registrationServiceImpl.register(request);
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
        registrationServiceImpl.confirmEmail(registerCode,response,request);

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
        assertThatThrownBy(() -> registrationServiceImpl.confirmEmail(registerCode, response, request))
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
        registrationServiceImpl.confirmEmail(registerCode, response, request);

        //then
        verify(userRepository,never()).saveAndFlush(any());
        verify(response, times(1)).sendRedirect(startsWith("/"));
    }

}