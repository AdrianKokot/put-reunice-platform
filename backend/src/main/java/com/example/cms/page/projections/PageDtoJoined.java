package com.example.cms.page.projections;

import com.example.cms.page.Page;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageDtoJoined {
    private Long id;
    private String title;
    private Long universityId;

    public static PageDtoJoined of(Page page) {
        if (page == null) {
            return null;
        }
        return new PageDtoJoined(page);
    }

    private PageDtoJoined(Page page) {
        id = page.getId();
        title = page.getTitle();
        universityId = page.getUniversity().getId();
    }
}
