package put.eunice.cms.search.services;

import java.util.Collection;
import java.util.List;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import put.eunice.cms.page.Page;
import put.eunice.cms.search.FullTextSearchService;
import put.eunice.cms.search.projections.PageSearchHitDto;

@Service
@Profile("!postgres")
public class DummyPageFullTextSearchService
        implements FullTextSearchService<Page, PageSearchHitDto> {

    @Override
    public void upsert(Page item) {}

    @Override
    public void upsert(Collection<Page> item) {}

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
