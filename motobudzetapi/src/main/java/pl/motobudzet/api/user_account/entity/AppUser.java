package pl.motobudzet.api.user_account.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import pl.motobudzet.api.advertisement.entity.Advertisement;
import pl.motobudzet.api.location_city.City;
import pl.motobudzet.api.user_account.model.Role;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;
import java.util.Set;

import static pl.motobudzet.api.z_configuration.securty_jwt.UserDetailsServiceImpl.mapRolesToAuthorities;


@Entity
@Setter
@Getter
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
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
    private Boolean accountEnabled;
    private Boolean accountNotLocked;
    private Boolean accountNotExpired;
    private Boolean credentialsNotExpired;
    private LocalDateTime resetPasswordCodeExpiration;
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
    private City city;
    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.REMOVE})
    @JsonManagedReference
    private Set<Advertisement> advertisements;
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
