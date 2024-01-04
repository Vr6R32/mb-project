package pl.motobudzet.api.z_configuration.security;


import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.user_account.entity.Role;
import pl.motobudzet.api.user_account.repository.AppUserRepository;

import java.util.Collection;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final AppUserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        return userRepository.findByUserName(userName).orElseThrow(() -> new RuntimeException("User Doesn't exists !"));
    }

    public static Collection< ? extends GrantedAuthority> mapRolesToAuthorities(Collection <Role> roles) {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toList());
    }
}
