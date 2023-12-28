package com.example.cms.search;

import java.util.Collection;
import java.util.List;

public interface FullTextSearchService<T, TDto> {
    void upsert(T item);

    void upsert(Collection<T> items);

    void delete(T item);

    void deleteCollection();

    void createCollection();

    List<TDto> search(String query);
}
