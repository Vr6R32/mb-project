package pl.motobudzet.api.z_configuration.securty_jwt.token;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {

    @Query("select t from Token t where t.userId = ?1")
    List<Token> findAllValidTokenByUser(Long id);

    Optional<Token> findByToken(String token);

    @Modifying
    @Transactional
    @Query("UPDATE Token t SET t.expired = true, t.revoked = true WHERE t.token = :accessToken OR t.token = :refreshToken")
    void setTokensExpiredAndRevoked(String accessToken, String refreshToken);

}
