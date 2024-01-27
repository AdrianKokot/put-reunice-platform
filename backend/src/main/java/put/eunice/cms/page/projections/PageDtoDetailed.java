package put.eunice.cms.page.projections;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import put.eunice.cms.page.Page;
import put.eunice.cms.university.projections.UniversityDtoSimple;
import put.eunice.cms.user.projections.UserDtoSimple;

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
    private boolean hasContactRequestHandler;
    private boolean hasResources;

    public static PageDtoDetailed of(Page page, boolean hasResources) {
        return of(page, hasResources, List.of());
    }

    public static PageDtoDetailed of(Page page, boolean hasResources, List<Page> children) {
        if (page == null) {
            return null;
        }
        return new PageDtoDetailed(page, hasResources, children);
    }

    private PageDtoDetailed(Page page, boolean hasResources, List<Page> children) {
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
        this.hasResources = hasResources;
    }
}
