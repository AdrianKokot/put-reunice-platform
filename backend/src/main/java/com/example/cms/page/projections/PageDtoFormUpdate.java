package com.example.cms.page.projections;

import com.example.cms.page.Content;
import com.example.cms.page.Page;
import lombok.Value;

@Value
public class PageDtoFormUpdate {
    String title;
    String description;
    String content;
    Boolean hidden;

    public void updatePage(Page page) {
        page.setTitle(title);
        page.setDescription(description);
        page.setHidden(hidden);
        page.setContent(Content.of(content));
    }
}
