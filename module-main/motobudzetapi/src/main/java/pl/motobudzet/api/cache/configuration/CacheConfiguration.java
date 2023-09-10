package pl.motobudzet.api.cache.configuration;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfiguration {

//    @Bean
//    public CacheManager cacheManager() {
//        return new EhCacheCacheManager(ehCacheManager());
//    }
//
//    @Bean(destroyMethod = "shutdown")
//    public net.sf.ehcache.CacheManager ehCacheManager() {
//        net.sf.ehcache.config.Configuration config = new net.sf.ehcache.config.Configuration();
//        CacheConfiguration cacheConfig = new CacheConfiguration();
//        cacheConfig.setName("advertisements_filter_cache");
//        cacheConfig.setMaxEntriesLocalHeap(1000); // Maksymalna liczba wpisów w cache
//        cacheConfig.timeToLiveSeconds(3600); // Czas przechowywania wpisu w cache (3600 sekund = 1 godzina)
//        cacheConfig.persistence(new PersistenceConfiguration().strategy(PersistenceConfiguration.Strategy.NONE)); // Wyłącz persystencję
//        config.addCache(cacheConfig);
//        return net.sf.ehcache.CacheManager.newInstance(config);
//    }

    // Pozostała część konfiguracji
}