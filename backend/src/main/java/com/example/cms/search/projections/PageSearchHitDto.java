package com.example.cms.search.projections;

import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.typesense.model.SearchHighlight;
import org.typesense.model.SearchResultHit;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageSearchHitDto {
    private Long id;
    private Long pageId;
    private Long universityId;
    private String title;
    private String universityName;
    private Map<String, String> highlight;

    public static PageSearchHitDto from(SearchResultHit hit) {
        Map<String, Object> doc = hit.getDocument();

        return new PageSearchHitDto(
                Long.parseLong(doc.get("pageId").toString()),
                Long.parseLong(doc.get("pageId").toString()),
                Long.parseLong(doc.get("universityId").toString()),
                doc.get("title").toString(),
                doc.get("universityName").toString(),
                hit.getHighlights().stream()
                        .collect(
                                java.util.stream.Collectors.toMap(
                                        SearchHighlight::getField, SearchHighlight::getSnippet)));
    }
}
