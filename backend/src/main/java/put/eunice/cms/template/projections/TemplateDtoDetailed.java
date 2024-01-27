package put.eunice.cms.template.projections;

import java.util.Set;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import put.eunice.cms.template.Template;
import put.eunice.cms.university.projections.UniversityDtoSimple;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TemplateDtoDetailed {
    private Long id;
    private String name;
    private String content;
    private Set<UniversityDtoSimple> universities;
    private boolean availableToAllUniversities;

    public static TemplateDtoDetailed of(Template template) {
        if (template == null) {
            return null;
        }
        return new TemplateDtoDetailed(template);
    }

    private TemplateDtoDetailed(Template template) {
        id = template.getId();
        name = template.getName();
        content = template.getContent();
        universities =
                template.getUniversities().stream()
                        .map(UniversityDtoSimple::of)
                        .collect(Collectors.toSet());
        availableToAllUniversities = template.isAvailableToAll();
    }
}
