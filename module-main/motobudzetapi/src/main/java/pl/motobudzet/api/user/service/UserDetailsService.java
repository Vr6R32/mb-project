package pl.motobudzet.api.user.service;


import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.locationCity.service.CityService;
import pl.motobudzet.api.user.dto.AppUserDTO;
import pl.motobudzet.api.user.dto.UserDetailsRequest;
import pl.motobudzet.api.user.entity.AppUser;
import pl.motobudzet.api.user.entity.Role;
import pl.motobudzet.api.user.repository.AppUserRepository;
import pl.motobudzet.api.user.repository.RoleRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static pl.motobudzet.api.utils.mappers.AppUserMapper.mapUserToDTO;

@Service
@RequiredArgsConstructor
public class UserDetailsService {

    private final AppUserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CityService cityService;

    public AppUserDTO getUserDetails(String userName) {
        AppUser user = userRepository.findByUserNameForDto(userName).orElseThrow(() -> new IllegalArgumentException("USER_DOESNT_EXIST"));
        return mapUserToDTO(user);
    }

    public String updateFirstUserDetails(UserDetailsRequest request, String loggedUser) {

        AppUser user = userRepository.findByUserNameForDto(loggedUser).orElseThrow(() -> new IllegalArgumentException("USER_DOESNT_EXIST"));
        List<Role> roles = new ArrayList<>();
        roles.add(roleRepository.findByName("ROLE_USER").orElseThrow(() -> new IllegalArgumentException("ROLE_DOESNT_EXIST")));

        user.setCity(cityService.getCityByNameAndState(request.getCity(), request.getCityState()));
        user.setName(request.getName());
        user.setSurname(request.getSurname());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRoles(roles);

        userRepository.saveAndFlush(user);

        setAuthentication(user, roles);

        return "/?activation=true";
    }

    private void setAuthentication(AppUser user, List<Role> roles) {
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(user, null, roles.stream().map(role -> new SimpleGrantedAuthority(role.getName())).toList());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }
}
