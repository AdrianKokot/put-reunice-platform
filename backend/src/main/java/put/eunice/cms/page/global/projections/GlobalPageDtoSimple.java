package put.eunice.cms.page.global.projections;

import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import put.eunice.cms.page.global.GlobalPage;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GlobalPageDtoSimple {
    private Long id;
    private String title;
    private boolean hidden;
    private boolean isLanding;
    private Instant createdOn;
    private Instant updatedOn;

    public static GlobalPageDtoSimple of(GlobalPage page) {
        return new GlobalPageDtoSimple(page);
    }

    private GlobalPageDtoSimple(GlobalPage page) {
        id = page.getId();
        title = page.getTitle();
        hidden = page.isHidden();
        isLanding = page.isLanding();
        createdOn = page.getCreatedOn().toInstant();
        updatedOn = page.getUpdatedOn().toInstant();
    }
}
