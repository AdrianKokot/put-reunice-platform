package put.eunice.cms.template.projections;

import java.util.Set;
import lombok.Value;

@Value
public class TemplateDtoFormCreate {
    String name;
    String content;
    Set<Long> universities;
    boolean availableToAllUniversities;
}
