package com.example.cms.template.projections;

import com.example.cms.template.Template;
import lombok.Value;

import java.util.Set;

@Value
public class TemplateDtoFormCreate {
    String name;
    String content;
    Set<Long> universities;
    Boolean availableToAllUniversities;

    public Template toTemplate() {
        Template template = new Template();

        template.setName(name);
        template.setContent(content);
        template.setIsAvailableToAll(availableToAllUniversities);

        return template;
    }
}
