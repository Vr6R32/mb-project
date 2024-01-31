package pl.motobudzet.api.infrastructure.configuration.securty_jwt.token;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TokenRepository extends JpaRepository<Token, Long> {

    @Query("SELECT t FROM Token t WHERE t.userId = :userId AND t.expired = false AND t.revoked = false")
    List<Token> findAllValidTokenByUser(@Param("userId") Long userId);

    @Modifying
    @Transactional
    @Query("UPDATE Token t SET t.expired = true, t.revoked = true WHERE t.token = :accessToken OR t.token = :refreshToken")
    void setTokensExpiredAndRevoked(String accessToken, String refreshToken);

}
