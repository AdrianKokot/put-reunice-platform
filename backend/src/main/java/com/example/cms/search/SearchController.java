package com.example.cms.search;

import com.example.cms.page.Page;
import com.example.cms.search.projections.PageSearchHitDto;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
