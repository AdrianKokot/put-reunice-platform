package com.example.cms.page.projections;

import com.example.cms.page.Page;
import com.example.cms.university.projections.UniversityDtoSimple;
import com.example.cms.user.projections.UserDtoSimple;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
