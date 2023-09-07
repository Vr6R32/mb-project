package pl.motobudzet.api.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;
import pl.motobudzet.api.user.entity.AppUser;

import java.util.Optional;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser,Long> {
    @Query("select a from AppUser a left join fetch a.roles where a.userName = ?1")
    Optional<AppUser> findByUserName(String userName);

    Optional<AppUser> findByEmail(String email);

}
