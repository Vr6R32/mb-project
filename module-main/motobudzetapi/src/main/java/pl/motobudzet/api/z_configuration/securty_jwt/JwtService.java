package pl.motobudzet.api.z_configuration.securty_jwt;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import pl.motobudzet.api.user_account.entity.AppUser;
import pl.motobudzet.api.user_account.repository.AppUserRepository;
import pl.motobudzet.api.z_configuration.securty_jwt.token.Token;
import pl.motobudzet.api.z_configuration.securty_jwt.token.TokenRepository;
import pl.motobudzet.api.z_configuration.securty_jwt.token.TokenType;

import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${application.security.jwt.secret-key}")
    private String secretKey;
    @Value("${application.security.jwt.expiration}")
    private long jwtExpiration;
    @Value("${application.security.jwt.refresh-token.expiration}")
    private long refreshExpiration;

    private final AppUserRepository userRepository;
    private final TokenRepository tokenRepository;

    public JwtService(AppUserRepository userRepository, TokenRepository tokenRepository) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateAccessToken(UserDetails userDetails) {
        AppUser user = (AppUser) userDetails;
        Map<String, Object> userClaims = Map.of("roles", userDetails.getAuthorities(),"userId",user.getId());
        return buildToken(userClaims, userDetails, jwtExpiration);
    }
    public String generateRefreshToken(UserDetails userDetails) {
        AppUser user = (AppUser) userDetails;
        Map<String, Object> userClaims = Map.of("roles", userDetails.getAuthorities(),"userId",user.getId());
        return buildToken(userClaims, userDetails, refreshExpiration);
    }

    private String buildToken(Map<String, Object> extraClaims, UserDetails userDetails, long expiration) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private void saveUserToken(AppUser user, String jwtToken) {
        var token = Token.builder()
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .userId(user.getId())
                .build();
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(AppUser user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    public void refreshToken(String refreshToken, HttpServletRequest request, HttpServletResponse response) {

        final String username = extractUsername(refreshToken);

        if (username != null) {
            AppUser user = userRepository.findByUserName(username).orElseThrow();

            if (isTokenValid(refreshToken, user)) {
                setAuthenticationResponse(user, response);
            }
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }

    public void authenticate(AppUser user,HttpServletResponse response){
        setAuthenticationResponse(user, response);
    }

    private void setAuthenticationResponse(AppUser user, HttpServletResponse response) {
        var accessToken = generateAccessToken(user);
        var refreshToken = generateRefreshToken(user);

        revokeAllUserTokens(user);
        saveUserToken(user, accessToken);

        HttpHeaders httpHeaders = buildHttpTokenHeaders(accessToken, refreshToken);
        applyHttpHeaders(response, httpHeaders);
        response.setStatus(HttpServletResponse.SC_NO_CONTENT);
    }


    public void applyHttpHeaders(HttpServletResponse response, HttpHeaders httpHeaders) {
        httpHeaders.forEach((headerName, headerValues) -> {
            headerValues.forEach(value -> {
                response.addHeader(headerName, value);
            });
        });
    }
    private HttpHeaders buildHttpTokenHeaders(String accessToken, String refreshToken) {

        String accessTokenExpirationTime = String.valueOf(extractClaim(accessToken, Claims::getExpiration).getTime());
        String refreshTokenExpirationTime = String.valueOf(extractClaim(refreshToken, Claims::getExpiration).getTime());

        ResponseCookie accessTokenCookie = ResponseCookie.from("accessToken", accessToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(jwtExpiration/1000)
                .build();

        ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(refreshExpiration/7 * 24 * 60 * 60)
                .build();

        ResponseCookie accessTokenExpirationTimeCookie = ResponseCookie.from("accessTokenExpirationTime", accessTokenExpirationTime)
                .httpOnly(false)
                .secure(true)
                .path("/")
                .maxAge(jwtExpiration/1000)
                .build();

        ResponseCookie refreshTokenExpirationTimeCookie = ResponseCookie.from("refreshTokenExpirationTime", refreshTokenExpirationTime)
                .httpOnly(false)
                .secure(true)
                .path("/")
                .maxAge(refreshExpiration/7 * 24 * 60 * 60)
                .build();

        return getHttpHeaders(accessTokenCookie, refreshTokenCookie, accessTokenExpirationTimeCookie, refreshTokenExpirationTimeCookie);
    }

    public HttpHeaders resetHttpTokenHeaders() {

        ResponseCookie accessTokenCookie = ResponseCookie.from("accessToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();

        ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();

        ResponseCookie accessTokenExpirationTimeCookie = ResponseCookie.from("accessTokenExpirationTime", "")
                .httpOnly(false)
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();

        ResponseCookie refreshTokenExpirationTimeCookie = ResponseCookie.from("refreshTokenExpirationTime", "")
                .httpOnly(false)
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();

        return getHttpHeaders(accessTokenCookie, refreshTokenCookie, accessTokenExpirationTimeCookie, refreshTokenExpirationTimeCookie);
    }

    private HttpHeaders getHttpHeaders(ResponseCookie accessTokenCookie, ResponseCookie refreshTokenCookie, ResponseCookie accessTokenExpirationTimeCookie, ResponseCookie refreshTokenExpirationTimeCookie) {
        HttpHeaders headers = new HttpHeaders();

        headers.add(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());
        headers.add(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());
        headers.add(HttpHeaders.SET_COOKIE, accessTokenExpirationTimeCookie.toString());
        headers.add(HttpHeaders.SET_COOKIE, refreshTokenExpirationTimeCookie.toString());
        return headers;
    }
}
