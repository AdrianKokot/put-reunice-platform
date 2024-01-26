package put.eunice.cms.search;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import put.eunice.cms.page.Page;
import put.eunice.cms.search.projections.PageSearchHitDto;

@RestController
@RequiredArgsConstructor
@RequestMapping("/search")
public class SearchController {
    private final FullTextSearchService<Page, PageSearchHitDto> pageService;

    @GetMapping("/pages")
    ResponseEntity<List<PageSearchHitDto>> searchPages(@RequestParam String query) {
        return ResponseEntity.ok(pageService.search(query));
    }
}
