package com.example.cms.template;

import com.example.cms.template.projections.TemplateDtoDetailed;
import com.example.cms.template.projections.TemplateDtoSimple;
import com.example.cms.user.User;
import com.example.cms.validation.FilterPathVariableValidator;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;

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

    @GetMapping("/all")
    ResponseEntity<List<TemplateDtoDetailed>> readAllTemplates(Pageable pageable, @RequestParam Map<String, String> vars) {

        return new ResponseEntity<>(
                service.getAll(
                        pageable,
                        FilterPathVariableValidator.validate(vars, Template.class)),
                HttpStatus.OK);
    }

    @GetMapping
    List<TemplateDtoSimple> readAllTemplatesByUniversity(Pageable pageable, @RequestParam long universityID) {
        return service.getAllByUniversity(pageable, universityID);
    }

    @PostMapping
    ResponseEntity<TemplateDtoDetailed> createTemplate(@RequestBody String name) {
        TemplateDtoDetailed result = service.save(name);
        return ResponseEntity.created(URI.create("/" + result.getId())).body(result);
    }

    @PostMapping("/{templateID}/universities/{universityID}")
    TemplateDtoDetailed addUniversityToTemplate(@PathVariable long templateID,
                                                @PathVariable long universityID) {
        return service.addUniversity(templateID, universityID);
    }

    @DeleteMapping("/{templateID}/universities/{universityID}")
    TemplateDtoDetailed removeUniversityFromTemplate(@PathVariable long templateID,
                                                      @PathVariable long universityID) {
        return service.removeUniversity(templateID, universityID);
    }

    @PatchMapping("/{id}/name")
    ResponseEntity<Void> modifyPageNameField(@PathVariable long id, @RequestBody String name) {
        service.modifyNameField(id, name);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/content")
    ResponseEntity<Void> modifyPageContentField(@PathVariable long id, @RequestBody String content) {
        service.modifyContentField(id, content);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    ResponseEntity<Void> deletePage(@PathVariable long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
