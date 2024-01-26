package put.eunice.cms.page.global.projections;

import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import put.eunice.cms.page.global.GlobalPage;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GlobalPageDtoDetailed {
    private Long id;
    private String title;
    private boolean hidden;
    private String content;
    private Instant createdOn;
    private Instant updatedOn;
    private boolean isLanding;

    public static GlobalPageDtoDetailed of(GlobalPage page) {
        return new GlobalPageDtoDetailed(page);
    }

    private GlobalPageDtoDetailed(GlobalPage page) {
        id = page.getId();
        title = page.getTitle();
        hidden = page.isHidden();
        content = page.getContent().getPageContent();
        createdOn = page.getCreatedOn().toInstant();
        updatedOn = page.getUpdatedOn().toInstant();
        isLanding = page.isLanding();
    }
}
