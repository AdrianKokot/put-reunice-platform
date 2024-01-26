package put.eunice.cms.page.projections;

import lombok.Value;

@Value
public class PageDtoFormCreate {
    String title;
    String description;
    String content;
    Long creatorId;
    Long parentId;
    Boolean hidden;
}
