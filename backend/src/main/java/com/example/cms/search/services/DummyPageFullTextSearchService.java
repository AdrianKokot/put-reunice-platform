package com.example.cms.search.services;

import com.example.cms.page.Page;
import com.example.cms.search.FullTextSearchService;
import com.example.cms.search.projections.PageSearchHitDto;
import java.util.List;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Profile("!postgres")
public class DummyPageFullTextSearchService
        implements FullTextSearchService<Page, PageSearchHitDto> {

    @Override
    public void upsert(Page item) {}

    @Override
    public void delete(Page item) {}

    @Override
    public void deleteCollection() {}

    @Override
    public void createCollection() {}

    @Override
    public List<PageSearchHitDto> search(String query) {
        return List.of();
    }
}
