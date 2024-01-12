package com.example.cms.page.projections;

import com.example.cms.page.GlobalPage;
import com.example.cms.page.Page;
import com.example.cms.university.projections.UniversityDtoSimple;
import com.example.cms.user.projections.UserDtoSimple;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageDtoDetailed {
    private Long id;
    private PageDtoSimple parent;
    private String title;
    private String description;
    private UserDtoSimple creator;
    private UniversityDtoSimple university;
    private boolean hidden;
    private String content;
    private List<PageDtoSimple> children;
    private Instant createdOn;
    private Instant updatedOn;
    private List<UserDtoSimple> contactRequestHandlers;
    private Boolean hasContactRequestHandler;

    public static PageDtoDetailed of(Page page) {
        return of(page, List.of());
    }

    public static PageDtoDetailed of(GlobalPage page) {
        if (page == null) {
            return null;
        }

        return new PageDtoDetailed(page);
    }

    public static PageDtoDetailed of(Page page, List<Page> children) {
        if (page == null) {
            return null;
        }
        return new PageDtoDetailed(page, children);
    }

    private PageDtoDetailed(Page page, List<Page> children) {
        id = page.getId();
        title = page.getTitle();
        description = page.getDescription();
        creator = UserDtoSimple.of(page.getCreator());
        hidden = page.isHidden();
        content = page.getContent().getPageContent();
        university = UniversityDtoSimple.of(page.getUniversity());
        parent = PageDtoSimple.of(page.getParent());

        this.children = children.stream().map(PageDtoSimple::of).collect(Collectors.toList());

        createdOn = page.getCreatedOn().toInstant();
        updatedOn = page.getUpdatedOn().toInstant();
        contactRequestHandlers =
                page.getHandlers().stream().map(UserDtoSimple::of).collect(Collectors.toList());
        hasContactRequestHandler = !contactRequestHandlers.isEmpty();
    }

    private PageDtoDetailed(GlobalPage page) {
        id = page.getId();
        title = page.getTitle();
        hidden = page.isHidden();
        content = page.getContent().getPageContent();
        createdOn = page.getCreatedOn().toInstant();
        updatedOn = page.getUpdatedOn().toInstant();
        children = List.of();
        contactRequestHandlers = List.of();
        hasContactRequestHandler = false;
    }
}
