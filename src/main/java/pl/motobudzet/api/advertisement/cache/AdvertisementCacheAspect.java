package pl.motobudzet.api.advertisement.cache;

import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AdvertisementCacheAspect {

//    @Cacheable("advertisements")
//    @AfterReturning(pointcut = "execution(* pl.motobudzet.api.advertisement.repository.AdvertisementRepository.findAll(..))", returning = "result")
//    public Page<Advertisement> cacheFindAll(Page<Advertisement> result) {
//        return result;
//    }

//    @CacheEvict(value = "advertisements", allEntries = true)
//    public void evictCache() {
//        // Ta metoda będzie wywoływana, gdy zaktualizujemy dane reklamy w bazie danych
//        // i spowoduje usunięcie całego cache'a dla ogłoszeń.
//    }
}
