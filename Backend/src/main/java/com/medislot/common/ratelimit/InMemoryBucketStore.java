package com.medislot.common.ratelimit;

import io.github.bucket4j.Bucket;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Supplier;

@Component
public class InMemoryBucketStore implements BucketStore {

    private static final int MAX_BUCKET_CACHE_SIZE = 10000;
    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    @Override
    public Bucket getBucket(String key, Supplier<Bucket> bucketSupplier) {
        if (cache.size() >= MAX_BUCKET_CACHE_SIZE && !cache.containsKey(key)) {
            // Evict oldest entries when cache capacity limit is reached
            cache.keySet().stream().limit(1000).forEach(cache::remove);
        }
        return cache.computeIfAbsent(key, k -> bucketSupplier.get());
    }

    @Override
    public void clear() {
        cache.clear();
    }

    @Override
    public int size() {
        return cache.size();
    }
}
