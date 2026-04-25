package com.sundtrack.catan.common;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

public final class CollectionUtils {

    // Private constructor prevents instantiation
    private CollectionUtils() {
        throw new UnsupportedOperationException("Utility class");
    }

    /**
     * Returns a new shuffled list while leaving the original list untouched.
     */
    public static <T> List<T> shuffled(List<T> list, Random random) {
        if (list == null) return List.of();
        List<T> copy = new ArrayList<>(list);
        Collections.shuffle(copy, random);
        return copy;
    }
}
