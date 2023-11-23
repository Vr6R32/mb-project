package pl.motobudzet.api.user.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.user.entity.AppUser;
import pl.motobudzet.api.user.repository.AppUserRepository;

@Service
@RequiredArgsConstructor
public class AppUserCustomService {

    private final AppUserRepository userRepository;

    public AppUser getUserByName(String userName) {
        return userRepository.findByUserName(userName).orElseThrow(() -> new RuntimeException("User doesnt' exists!"));
    }
    public Long getUserIdByUserName(String userName) {
        return userRepository.getAppUserIdByUserName(userName).orElseThrow(() -> new RuntimeException("User doesnt' exists!"));
    }
}
