package com.example.cms.page;

import com.example.cms.page.projections.*;
import com.example.cms.validation.FilterPathVariableValidator;
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

@RestController
@RequiredArgsConstructor
@RequestMapping("/pages")
public class PageController {

    private final PageService service;

    @GetMapping("/{id}")
    PageDtoDetailed readSinglePage(@PathVariable long id) {
        return service.get(id);
    }

    @GetMapping
    ResponseEntity<List<PageDtoSimple>> readAllPages(
            Pageable pageable, @RequestParam Map<String, String> vars) {

        org.springframework.data.domain.Page<Page> responsePage =
                service.getAllVisible(pageable, FilterPathVariableValidator.validate(vars, Page.class));

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("X-Whole-Content-Length", String.valueOf(responsePage.getTotalElements()));

        return new ResponseEntity<>(
                responsePage.stream().map(PageDtoSimple::of).collect(Collectors.toList()),
                httpHeaders,
                HttpStatus.OK);
    }

    @GetMapping("/creator/{userId}")
    List<PageDtoSimple> readCreatorPages(@PathVariable long userId, Pageable pageable) {
        return service.getCreatorPages(pageable, userId);
    }

    @GetMapping("/main")
    List<PageDtoSimple> readMainPages(Pageable pageable) {
        return service.getSubpagesByParentPage(pageable, null);
    }

    @GetMapping("/children/{parentId}")
    List<PageDtoSimple> readSubpages(Pageable pageable, @PathVariable long parentId) {
        return service.getSubpagesByParentPage(pageable, parentId);
    }

    @GetMapping("/hierarchy/{universityId}")
    PageDtoHierarchy readUniversityHierarchy(@PathVariable long universityId) {
        return service.getHierarchy(universityId);
    }

    @PostMapping
    ResponseEntity<PageDtoDetailed> createPage(@RequestBody PageDtoFormCreate form) {
        PageDtoDetailed result = service.save(form);
        return ResponseEntity.created(URI.create("/" + result.getId())).body(result);
    }

    @PutMapping("/{id}")
    ResponseEntity<Void> updatePage(@PathVariable long id, @RequestBody PageDtoFormUpdate form) {
        service.update(id, form);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    ResponseEntity<Void> deletePage(@PathVariable long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
