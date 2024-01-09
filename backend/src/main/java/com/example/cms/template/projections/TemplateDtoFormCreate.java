package com.example.cms.template.projections;

import com.example.cms.template.Template;
import com.example.cms.util.HTMLSanitiser;
import java.util.Set;
import lombok.Value;

@Value
public class TemplateDtoFormCreate {
    String name;
    String content;
    Set<Long> universities;
    Boolean availableToAllUniversities;

    public Template toTemplate() {
        Template template = new Template();

        template.setName(name);
        template.setContent(HTMLSanitiser.encodeInvalidMarkup(content));
        template.setIsAvailableToAll(availableToAllUniversities);

        return template;
    }
}
