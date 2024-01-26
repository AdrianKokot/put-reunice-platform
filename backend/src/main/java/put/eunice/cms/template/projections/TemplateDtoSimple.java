package put.eunice.cms.template.projections;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import put.eunice.cms.template.Template;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TemplateDtoSimple {
    private Long id;
    private String name;
    private String content;
    private boolean availableToAllUniversities;

    public static TemplateDtoSimple of(Template template) {
        if (template == null) {
            return null;
        }
        return new TemplateDtoSimple(template);
    }

    private TemplateDtoSimple(Template template) {
        id = template.getId();
        name = template.getName();
        content = template.getContent();
        availableToAllUniversities = template.isAvailableToAll();
    }
}
