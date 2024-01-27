package put.eunice.cms.page.global.projections;

import lombok.Value;

@Value
public class GlobalPageDtoFormUpdate {
    String title;
    String content;
    Boolean hidden;
}
