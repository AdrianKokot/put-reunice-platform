package put.eunice.cms.search;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import put.eunice.cms.page.PageRepository;
import put.eunice.cms.page.PageRoleSpecification;
import put.eunice.cms.search.projections.PageSearchHitDto;

@Slf4j
@Component
@RequiredArgsConstructor
public class FullTextSearchFeeder {
    private final FullTextSearchService<put.eunice.cms.page.Page, PageSearchHitDto> pageSearchService;
    private final PageRepository pageRepository;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void onApplicationReady() {
        log.info("** Feeding full text search service.");
        pageSearchService.createCollection();

        var visiblePages =
                pageRepository.findAll(Specification.where(new PageRoleSpecification(null, null, null)));

        log.info("** Feeding full text search service with {} pages.", visiblePages.size());

        pageSearchService.upsert(visiblePages);

        log.info("** Feeding full text search service done.");
    }
}
