package com.medislot.common.ratelimit;

import io.github.bucket4j.Bucket;

import java.util.function.Supplier;

/**
 * Abstraction for bucket storage.
 * Designed so InMemoryBucketStore can be replaced by Redis / distributed storage seamlessly.
 */
public interface BucketStore {

    Bucket getBucket(String key, Supplier<Bucket> bucketSupplier);

    void clear();

    int size();
}
