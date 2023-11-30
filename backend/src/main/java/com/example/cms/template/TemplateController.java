package com.example.cms.template;

import com.example.cms.template.projections.TemplateDtoDetailed;
import com.example.cms.template.projections.TemplateDtoFormCreate;
import com.example.cms.template.projections.TemplateDtoFormUpdate;
import com.example.cms.validation.FilterPathVariableValidator;
import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "templates")
public class TemplateController {
    private final TemplateService service;

    public TemplateController(TemplateService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    TemplateDtoDetailed readSingleTemplate(@PathVariable long id) {
        return service.get(id);
    }

    @GetMapping()
    ResponseEntity<List<TemplateDtoDetailed>> readAllTemplates(
            Pageable pageable, @RequestParam Map<String, String> vars) {

        Page<Template> responsePage =
                service.getAll(
                        pageable, FilterPathVariableValidator.validate(vars, Template.class));

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("X-Whole-Content-Length", String.valueOf(responsePage.getTotalElements()));

        return new ResponseEntity<>(
                responsePage.stream().map(TemplateDtoDetailed::of).collect(Collectors.toList()),
                httpHeaders,
                HttpStatus.OK);
    }

    @PostMapping
    ResponseEntity<TemplateDtoDetailed> createTemplate(@RequestBody TemplateDtoFormCreate form) {
        TemplateDtoDetailed result = service.save(form);
        return ResponseEntity.created(URI.create("/" + result.getId())).body(result);
    }

    @PutMapping("/{id}")
    ResponseEntity<Void> updateTemplate(
            @PathVariable long id, @RequestBody TemplateDtoFormUpdate form) {
        service.update(id, form);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{templateID}/universities/{universityID}")
    TemplateDtoDetailed addUniversityToTemplate(
            @PathVariable long templateID, @PathVariable long universityID) {
        return service.addUniversity(templateID, universityID);
    }

    @DeleteMapping("/{templateID}/universities/{universityID}")
    TemplateDtoDetailed removeUniversityFromTemplate(
            @PathVariable long templateID, @PathVariable long universityID) {
        return service.removeUniversity(templateID, universityID);
    }

    @PatchMapping("/{id}/name")
    ResponseEntity<Void> modifyPageNameField(@PathVariable long id, @RequestBody String name) {
        service.modifyNameField(id, name);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/content")
    ResponseEntity<Void> modifyPageContentField(
            @PathVariable long id, @RequestBody String content) {
        service.modifyContentField(id, content);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    ResponseEntity<Void> deletePage(@PathVariable long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
