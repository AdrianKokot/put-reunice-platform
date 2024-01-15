package com.example.cms.template;

import com.example.cms.SearchCriteria;
import com.example.cms.security.Role;
import com.example.cms.security.SecurityService;
import com.example.cms.template.exceptions.TemplateException;
import com.example.cms.template.exceptions.TemplateExceptionType;
import com.example.cms.template.exceptions.TemplateForbiddenException;
import com.example.cms.template.exceptions.TemplateNotFoundException;
import com.example.cms.template.projections.TemplateDtoDetailed;
import com.example.cms.template.projections.TemplateDtoFormCreate;
import com.example.cms.template.projections.TemplateDtoFormUpdate;
import com.example.cms.university.University;
import com.example.cms.university.UniversityRepository;
import com.example.cms.validation.exceptions.UnauthorizedException;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TemplateService {
    private final TemplateRepository templateRepository;
    private final UniversityRepository universityRepository;
    private final SecurityService securityService;

    public TemplateService(
            TemplateRepository templateRepository,
            UniversityRepository universityRepository,
            SecurityService securityService) {
        this.templateRepository = templateRepository;
        this.universityRepository = universityRepository;
        this.securityService = securityService;
    }

    @Secured("ROLE_USER")
    public TemplateDtoDetailed get(Long id) {
        var optionalTemplate =
                securityService.hasHigherOrEqualRoleThan(Role.ADMIN)
                        ? templateRepository.findById(id)
                        : templateRepository.findById_available(
                                id,
                                securityService
                                        .getPrincipal()
                                        .orElseThrow(UnauthorizedException::new)
                                        .getUniversities());

        return optionalTemplate
                .map(TemplateDtoDetailed::of)
                .orElseThrow(TemplateNotFoundException::new);
    }

    @Secured("ROLE_USER")
    public Page<Template> getAll(Pageable pageable, Map<String, String> filterVars) {
        Specification<Template> combinedSpecification =
                Specification.where(
                        securityService
                                .getPrincipal()
                                .map(
                                        loggedUser ->
                                                new TemplateRoleSpecification(
                                                        loggedUser.getAccountType(), loggedUser.getUniversities()))
                                .orElseGet(() -> new TemplateRoleSpecification(null, null)));

        if (!filterVars.isEmpty()) {
            List<TemplateSpecification> specifications =
                    filterVars.entrySet().stream()
                            .map(
                                    entries -> {
                                        String[] filterBy = entries.getKey().split("_");

                                        return new TemplateSpecification(
                                                new SearchCriteria(
                                                        filterBy[0], filterBy[filterBy.length - 1], entries.getValue()));
                                    })
                            .collect(Collectors.toList());

            for (Specification<Template> spec : specifications) {
                combinedSpecification = combinedSpecification.and(spec);
            }
        }

        return templateRepository.findAll(combinedSpecification, pageable);
    }

    @Secured("ROLE_USER")
    public TemplateDtoDetailed save(TemplateDtoFormCreate form) {
        if (form.isAvailableToAllUniversities()
                && !securityService.hasHigherOrEqualRoleThan(Role.ADMIN))
            throw new TemplateException(TemplateExceptionType.CANNOT_CREATE_TEMPLATE_AVAILABLE_TO_ALL);

        var template =
                new Template(form.getName(), form.getContent(), form.isAvailableToAllUniversities());

        attachUniversities(template, form.getUniversities());

        return TemplateDtoDetailed.of(templateRepository.save(template));
    }

    @Secured("ROLE_USER")
    @Transactional
    public void delete(Long id) {
        Template template = templateRepository.findById(id).orElseThrow(TemplateNotFoundException::new);

        if (securityService.isTemplateForbidden(template, true)) throw new TemplateForbiddenException();

        templateRepository.delete(template);
    }

    @Secured("ROLE_USER")
    public TemplateDtoDetailed update(long id, TemplateDtoFormUpdate form) {
        Template template = templateRepository.findById(id).orElseThrow(TemplateNotFoundException::new);

        if (form.isAvailableToAllUniversities()
                && !securityService.hasHigherOrEqualRoleThan(Role.ADMIN))
            throw new TemplateException(TemplateExceptionType.CANNOT_MARK_AS_AVAILABLE_TO_ALL);

        if (securityService.isTemplateForbidden(template, true)) throw new TemplateForbiddenException();

        template.setName(form.getName());
        template.setContent(form.getContent());
        template.setAvailableToAll(form.isAvailableToAllUniversities());

        attachUniversities(template, form.getUniversities());

        return TemplateDtoDetailed.of(templateRepository.save(template));
    }

    private void attachUniversities(Template template, Set<Long> universityIds) {
        if (template.isAvailableToAll()) {
            template.getUniversities().clear();
            return;
        }

        for (var id : universityIds) {
            if (!securityService.hasUniversity(id)) {
                throw new TemplateException(TemplateExceptionType.UNIVERSITY_FORBIDDEN, "universities");
            }
        }

        Set<Long> uniqueUniversityIds =
                Stream.concat(
                                universityIds.stream(),
                                securityService
                                        .getPrincipal()
                                        .orElseThrow(UnauthorizedException::new)
                                        .getUniversities()
                                        .stream())
                        .collect(Collectors.toSet());

        Set<University> universities =
                new HashSet<>(universityRepository.findAllById(uniqueUniversityIds));

        template.setUniversities(universities);
    }
}
