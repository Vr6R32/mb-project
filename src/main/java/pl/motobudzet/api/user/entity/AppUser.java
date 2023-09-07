package pl.motobudzet.api.user.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import pl.motobudzet.api.advertisement.entity.Advertisement;
import pl.motobudzet.api.user_conversations.entity.Conversation;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Setter
@Getter
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class AppUser implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Column(nullable=false,unique = true)
    String userName;
    @Column(nullable = false)
    String password;
    @Column(nullable = false,unique = true)
    @Schema(description = "Pictogram URL | ecommerceName -> ProductEnergyClassRestDto.pictogramUrt", nullable = true)
    String email;
    Boolean accountEnabled;
    Boolean accountNotLocked;
    Boolean accountNotExpired;
    Boolean credentialsNotExpired;
    @OneToMany(fetch = FetchType.LAZY,cascade = CascadeType.MERGE)
    @JsonManagedReference
    @JoinTable(
            name = "app_user_advertisements",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "advertisement_id", referencedColumnName = "id")
    )
    private List<Advertisement> advertisements;
    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.PERSIST)
    @JoinTable(
            name = "user_role_mapping",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"),
            uniqueConstraints = @UniqueConstraint(name = "unique_user_role", columnNames = {"user_id", "role_id"})
    )
    private List<Role> roles;
//    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST)
//    @JoinTable(
//            name = "user_conversations",
//            joinColumns = @JoinColumn(name = "user_owner_id", referencedColumnName = "id"),
//            inverseJoinColumns = {
//                    @JoinColumn(name = "conversation_id", referencedColumnName = "id"),
//                    @JoinColumn(name = "user_client_id", referencedColumnName = "userClientId")
//            }
//    )
//    private List<Conversation> conversations;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<Role> getRoles() {
        return this.roles;
    }

    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return mapRolesToAuthorities(getRoles());
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

    private Collection < ? extends GrantedAuthority> mapRolesToAuthorities(Collection <Role> roles) {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toList());
    }

}
