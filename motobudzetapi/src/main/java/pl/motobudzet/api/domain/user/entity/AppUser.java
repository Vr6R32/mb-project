package pl.motobudzet.api.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import pl.motobudzet.api.domain.user.model.Role;
import pl.motobudzet.api.domain.location.City;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;

import static pl.motobudzet.api.infrastructure.configuration.security.UserDetailsServiceImpl.mapRolesToAuthorities;


@Entity
@Setter
@Getter
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "app_users")
public class AppUser implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String userName;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false, unique = true)
    private String email;
    private String registerCode;
    private String resetPasswordCode;
    private String name;
    private String surname;
    private String phoneNumber;
    private boolean accountEnabled;
    private boolean accountNotLocked;
    private boolean accountNotExpired;
    private boolean credentialsNotExpired;
    private LocalDateTime resetPasswordCodeExpiration;
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
    private City city;
    @Enumerated(EnumType.STRING)
    private Role role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return mapRolesToAuthorities(Collections.singleton(getRole()));
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.userName;
    }

    @Override
    public boolean isAccountNonExpired() {
        return this.accountNotExpired;
    }

    @Override
    public boolean isAccountNonLocked() {
        return this.accountNotLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return this.credentialsNotExpired;
    }

    @Override
    public boolean isEnabled() {
        return this.accountEnabled;
    }

}
