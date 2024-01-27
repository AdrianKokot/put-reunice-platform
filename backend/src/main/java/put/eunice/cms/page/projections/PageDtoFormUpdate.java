package put.eunice.cms.page.projections;

import java.util.Set;
import lombok.Value;

@Value
public class PageDtoFormUpdate {
    String title;
    String description;
    String content;
    Boolean hidden;
    Set<Long> contactRequestHandlers;
    Long creatorId;
    Set<Long> resources;
}
