package com.example.cms.search;

import com.example.cms.search.projections.PageSearchHitDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/search")
public class SearchController {
    private final PageFullTextSearchService pageService;

    @GetMapping("/pages")
    ResponseEntity<List<PageSearchHitDto>> searchPages(@RequestParam String query) {
        return ResponseEntity.ok(pageService.search(query));
    }
}
