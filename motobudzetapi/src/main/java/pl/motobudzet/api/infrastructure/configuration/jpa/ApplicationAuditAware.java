package pl.motobudzet.api.infrastructure.configuration.jpa;

import org.springframework.data.domain.AuditorAware;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import pl.motobudzet.api.domain.user.AppUser;

import java.util.Optional;

public class ApplicationAuditAware implements AuditorAware<Long> {
    @Override
    @NonNull
    public Optional<Long> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication instanceof AnonymousAuthenticationToken) {
            return Optional.empty();
        }
        AppUser user = (AppUser) authentication.getPrincipal();
        return Optional.ofNullable(user.getId());
    }
}
