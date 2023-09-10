package pl.motobudzet.api.security.service;


import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.user.entity.AppUser;
import pl.motobudzet.api.user.repository.AppUserRepository;

import java.util.Collection;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final AppUserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        AppUser appUser = userRepository.findByUserName(userName).orElseThrow(() -> new RuntimeException("User Doesn't exists !"));
        Collection<? extends GrantedAuthority> authorities = appUser.getAuthorities();
        System.out.println(authorities);
        return appUser;
    }

//    public Collection< ? extends GrantedAuthority> mapRolesToAuthorities(Collection <Role> roles) {
//        return roles.stream()
//                .map(role -> new SimpleGrantedAuthority(role.getName()))
//                .collect(Collectors.toList());
//    }
}
