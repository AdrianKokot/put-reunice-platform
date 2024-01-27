package put.eunice.cms.page.projections;

import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import put.eunice.cms.page.Page;
import put.eunice.cms.university.projections.UniversityDtoSimple;
import put.eunice.cms.user.projections.UserDtoSimple;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageDtoSimple {
    private Long id;
    private String title;
    private String description;
    private UserDtoSimple creator;
    private UniversityDtoSimple university;
    private boolean hidden;
    private Instant createdOn;
    private Instant updatedOn;

    public static PageDtoSimple of(Page page) {
        if (page == null) {
            return null;
        }
        return new PageDtoSimple(page);
    }

    private PageDtoSimple(Page page) {
        id = page.getId();
        title = page.getTitle();
        description = page.getDescription();
        creator = UserDtoSimple.of(page.getCreator());
        university = UniversityDtoSimple.of(page.getUniversity());
        hidden = page.isHidden();
        createdOn = page.getCreatedOn().toInstant();
        updatedOn = page.getUpdatedOn().toInstant();
    }
}
