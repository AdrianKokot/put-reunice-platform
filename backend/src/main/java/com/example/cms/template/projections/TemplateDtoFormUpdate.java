package com.example.cms.template.projections;

import com.example.cms.template.Template;
import lombok.Value;

import java.util.Set;

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
