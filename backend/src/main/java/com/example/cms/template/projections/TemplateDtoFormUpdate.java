package com.example.cms.template.projections;

import com.example.cms.template.Template;
import java.util.Set;
import lombok.Value;

@Value
public class TemplateDtoFormUpdate {
    String name;
    String content;
    Set<Long> universities;
    Boolean availableToAllUniversities;

    public void updateTemplate(Template template) {
        template.setName(name);
        template.setContent(content);
        template.setIsAvailableToAll(availableToAllUniversities);
    }
}
