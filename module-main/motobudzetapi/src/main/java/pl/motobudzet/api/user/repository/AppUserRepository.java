package pl.motobudzet.api.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.motobudzet.api.user.entity.AppUser;

import java.util.Optional;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    @Query("select a from AppUser a left join fetch a.roles where a.userName = ?1")
    Optional<AppUser> findByUserName(String userName);


    @Query("select a from AppUser a " +
            "left join fetch a.roles " +
            "left join fetch a.city c " +
            "left join fetch c.cityState cs" +
            "left join fetch a.roles " +
            " where a.userName = ?1")
    Optional<AppUser> findByUserNameForDto(String userName);

//    @Query("select a from AppUser a left join fetch a.roles where a.email = ?1")
//    Optional<AppUser> findByEmail(String email);
//
//    @Query("select count(a) > 0 from AppUser a where a.userName = ?1")
//    boolean existsByUserName(String userName);
//
//    @Query("select count(a) > 0 from AppUser a where a.email = ?1")
//    boolean existsByEmail(String userName);
//
//    @Query("select count(a) > 0 from AppUser a where a.userName = ?1 or a.email = ?2")
//    boolean existByUsernameOrEmail(String userName,String email);

//    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN 'Username and/or email is already taken' ELSE 'Username and email are available' END FROM AppUser a WHERE a.userName = ?1 OR a.email = ?2")
//    String checkUsernameAndEmailAvailability(String userName, String email);

    @Query("SELECT CASE " +
            "WHEN SUM(CASE WHEN a.userName = ?1 THEN 1 ELSE 0 END) > 0 THEN 'Username is already taken' " +
            "WHEN SUM(CASE WHEN a.email = ?2 THEN 1 ELSE 0 END) > 0 THEN 'Email is already taken' " +
            "ELSE 'Both username and email are available' " +
            "END FROM AppUser a")
    String checkUsernameAndEmailAvailability(String userName, String email);

    @Query("select a.id from AppUser a where a.userName = ?1")
    Optional<Long> getAppUserIdByUserName(String username);

    @Query("select a from AppUser a where a.registerCode = ?1")
    Optional<AppUser> getAppUserByRegisterCode(String activationCode);

}
