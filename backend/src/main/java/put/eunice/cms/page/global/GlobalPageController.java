package put.eunice.cms.page.global;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import put.eunice.cms.page.global.projections.GlobalPageDtoDetailed;
import put.eunice.cms.page.global.projections.GlobalPageDtoFormCreate;
import put.eunice.cms.page.global.projections.GlobalPageDtoFormUpdate;
import put.eunice.cms.page.global.projections.GlobalPageDtoSimple;
import put.eunice.cms.validation.FilterPathVariableValidator;

@RestController
@RequiredArgsConstructor
@RequestMapping("/global-pages")
public class GlobalPageController {

    private final GlobalPageService service;

    @GetMapping("/main")
    GlobalPageDtoDetailed getLanding() {
        return service.getLanding();
    }

    @GetMapping("/{id}")
    GlobalPageDtoDetailed get(@PathVariable long id) {
        return service.get(id);
    }

    @GetMapping
    ResponseEntity<List<GlobalPageDtoSimple>> readAllPages(
            Pageable pageable, @RequestParam Map<String, String> vars) {

        var responsePage =
                service.getAll(pageable, FilterPathVariableValidator.validate(vars, GlobalPage.class));

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("X-Whole-Content-Length", String.valueOf(responsePage.getTotalElements()));

        return new ResponseEntity<>(
                responsePage.stream().map(GlobalPageDtoSimple::of).collect(Collectors.toList()),
                httpHeaders,
                HttpStatus.OK);
    }

    @PostMapping
    ResponseEntity<GlobalPageDtoDetailed> createPage(@RequestBody GlobalPageDtoFormCreate form) {
        var result = service.save(form);
        return ResponseEntity.created(URI.create("/" + result.getId())).body(result);
    }

    @PutMapping("/{id}")
    ResponseEntity<Void> updatePage(
            @PathVariable long id, @RequestBody GlobalPageDtoFormUpdate form) {
        service.update(id, form);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    ResponseEntity<Void> deletePage(@PathVariable long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
