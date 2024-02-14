package pl.motobudzet.api.persistance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.motobudzet.api.domain.user.AppUser;
import pl.motobudzet.api.model.Role;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    @Query("select a from AppUser a where a.userName = ?1")
    Optional<AppUser> findByUserName(String userName);

    @Query("select a from AppUser a " +
            "left join fetch a.city c " +
            "left join fetch c.cityState cs " +
            "where a.userName = ?1")
    Optional<AppUser> findUserDetailsByName(String userName);

    @Modifying
    @Query("UPDATE AppUser a SET a.resetPasswordCode = ?1, a.resetPasswordCodeExpiration = ?2 WHERE a.email = ?3")
    int insertResetPasswordCode(String code, LocalDateTime resetCodeExpirationTime, String email);

    @Modifying
    @Query("UPDATE AppUser a SET a.city.id = ?1, a.name = ?2, a.surname = ?3, a.phoneNumber = ?4, a.role = ?5 WHERE a.email = ?6")
    void insertUserFirstDetails(Long cityId, String name, String surname, String phoneNumber, Role role, String userEmail);

    @Modifying
    @Query("UPDATE AppUser a SET a.password = ?1, a.resetPasswordCode = null WHERE a.resetPasswordCode = ?2")
    int insertNewUserPassword(String newPassword, String resetCode);

    @Query("SELECT CASE " +
            "WHEN SUM(CASE WHEN a.userName = ?1 THEN 1 ELSE 0 END) > 0 THEN 'Username is already taken' " +
            "WHEN SUM(CASE WHEN a.email = ?2 THEN 1 ELSE 0 END) > 0 THEN 'Email is already taken' " +
            "ELSE 'Both username and email are available'" +
            "END FROM AppUser a")
    String checkUsernameAndEmailAvailability(String userName, String email);

    @Query("select a from AppUser a where a.registerCode = ?1")
    Optional<AppUser> findUserByRegistrationCode(String activationCode);

    @Query("select a from AppUser a " +
            "left join fetch a.city c " +
            "left join fetch c.cityState cs " +
            "where a.resetPasswordCode = ?1")
    Optional<AppUser> findUserByResetPasswordCode(String resetCode);

    @Query("select a.email from AppUser a where a.role = ?1")
    List<String> findAllManagementEmails(Role admin);
}
