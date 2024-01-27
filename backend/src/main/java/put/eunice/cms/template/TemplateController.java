package put.eunice.cms.template;

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
import put.eunice.cms.template.projections.TemplateDtoDetailed;
import put.eunice.cms.template.projections.TemplateDtoFormCreate;
import put.eunice.cms.template.projections.TemplateDtoFormUpdate;
import put.eunice.cms.validation.FilterPathVariableValidator;

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
                service.getAll(pageable, FilterPathVariableValidator.validate(vars, Template.class));

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
    ResponseEntity<TemplateDtoDetailed> updateTemplate(
            @PathVariable long id, @RequestBody TemplateDtoFormUpdate form) {
        return ResponseEntity.ok(service.update(id, form));
    }

    @DeleteMapping("/{id}")
    ResponseEntity<Void> deleteTemplate(@PathVariable long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
