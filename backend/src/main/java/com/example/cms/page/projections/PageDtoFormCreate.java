package com.example.cms.page.projections;

import com.example.cms.page.Content;
import com.example.cms.page.Page;
import com.example.cms.user.User;
import lombok.Value;

@Value
public class PageDtoFormCreate {
    String title;
    String description;
    String content;
    Long creatorId;
    Long parentId;
    Boolean hidden;

    public Page toPage(Page parent, User creator) {
        Page page = new Page();
        page.setTitle(title);
        page.setDescription(description);
        page.setContent(Content.of(content));
        page.setParent(parent);
        page.setUniversity(parent.getUniversity());
        page.setCreator(creator);
        // If parent page is hidden, create as hidden too
        page.setHidden(parent.isHidden() || hidden);
        return page;
    }
}
