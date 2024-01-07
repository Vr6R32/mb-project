package pl.motobudzet.api.z_configuration.securty_jwt;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;
import java.util.Base64;

@Component
public class TokenEncryption {

    private static final String ALGORITHM = "AES";
    private static final String TRANSFORMATION = "AES/CBC/PKCS5Padding";
    private static final int KEY_SIZE = 256; // AES-256

    @Value("${token.key.value}")
    private String keyString;

    @Value("${token.ivParameter.value}")
    private String ivString;

    @PostConstruct
    public void init() throws Exception {
        System.out.println("Generated Key: " + keyString);
        System.out.println("Generated IV: " + ivString);
    }

    public static String generateKeyString() throws Exception {
        SecretKey key = generateKey();
        return Base64.getEncoder().encodeToString(key.getEncoded());
    }

    private static SecretKey generateKey() throws Exception {
        KeyGenerator keyGenerator = KeyGenerator.getInstance(ALGORITHM);
        keyGenerator.init(KEY_SIZE, new SecureRandom());
        return keyGenerator.generateKey();
    }

    public static String generateIvString() {
        IvParameterSpec iv = generateIv();
        return Base64.getEncoder().encodeToString(iv.getIV());
    }

    private static IvParameterSpec generateIv() {
        byte[] iv = new byte[16]; // 128-bit IV for AES
        new SecureRandom().nextBytes(iv);
        return new IvParameterSpec(iv);
    }

    public String encrypt(String token) throws Exception {
        SecretKey key = decodeKeyFromString(keyString);
        IvParameterSpec iv = new IvParameterSpec(Base64.getDecoder().decode(ivString));
        Cipher cipher = Cipher.getInstance(TRANSFORMATION);
        cipher.init(Cipher.ENCRYPT_MODE, key, iv);
        byte[] cipherText = cipher.doFinal(token.getBytes());
        return Base64.getEncoder().encodeToString(cipherText);
    }

    public String decrypt(String token) throws Exception {
        SecretKey key = decodeKeyFromString(keyString);
        IvParameterSpec iv = new IvParameterSpec(Base64.getDecoder().decode(ivString));
        Cipher cipher = Cipher.getInstance(TRANSFORMATION);
        cipher.init(Cipher.DECRYPT_MODE, key, iv);
        byte[] plainText = cipher.doFinal(Base64.getDecoder().decode(token));
        return new String(plainText);
    }

    private static SecretKey decodeKeyFromString(String keyString) {
        byte[] decodedKey = Base64.getDecoder().decode(keyString);
        return new SecretKeySpec(decodedKey, 0, decodedKey.length, ALGORITHM);
    }
}
