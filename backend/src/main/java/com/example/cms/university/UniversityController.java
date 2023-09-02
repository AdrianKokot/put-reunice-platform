package com.example.cms.university;

import com.example.cms.security.SecurityService;
import com.example.cms.university.projections.UniversityDtoDetailed;
import com.example.cms.university.projections.UniversityDtoFormCreate;
import com.example.cms.university.projections.UniversityDtoFormUpdate;
import com.example.cms.university.projections.UniversityDtoSimple;
import com.example.cms.user.User;
import com.example.cms.validation.FilterPathVariableValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RestController
@RequiredArgsConstructor
@RequestMapping(path = "universities")
public class UniversityController {
    private final UniversityService service;
    private final SecurityService securityService;

    @GetMapping("/{id}")
    public UniversityDtoDetailed getUniversity(@PathVariable long id) {
        return service.getUniversity(id);
    }

    @GetMapping
    public ResponseEntity<List<UniversityDtoSimple>> getUniversities(Pageable pageable, @RequestParam Map<String, String> vars) {

        Page<University> responsePage = service.getUniversities(
                pageable,
                FilterPathVariableValidator.validate(vars, University.class));

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("X-Whole-Content-Length", String.valueOf(responsePage.getTotalElements()));

        return new ResponseEntity<>(
                responsePage.stream().map(UniversityDtoSimple::of).collect(Collectors.toList()),
                httpHeaders,
                HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<UniversityDtoDetailed> registerNewUniversity(@RequestBody UniversityDtoFormCreate form) {
        UniversityDtoDetailed result = service.addNewUniversity(new UniversityDtoFormCreate(form.getName(), form.getShortName(), form.getDescription(), securityService.getPrincipal().get().getId()));
        return ResponseEntity.created(URI.create("/" + result.getId())).body(result);
    }

    @PutMapping("/{universityId}")
    UniversityDtoDetailed updateUniversity(
            @PathVariable long universityId,
            @RequestBody UniversityDtoFormUpdate form) {
        return service.update(universityId, form);
    }

    @PutMapping("/{universityId}/users/{userId}")
    public UniversityDtoDetailed enrollUsersToUniversity(
            @PathVariable long universityId,
            @PathVariable long userId) {
        return service.enrollUsersToUniversity(universityId, userId);
    }

    @PatchMapping("/{id}/hidden")
    public ResponseEntity<Void> modifyUniversityHiddenField(@PathVariable Long id,
                                                            @RequestBody boolean hidden) {
        service.modifyHiddenField(id, hidden);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUniversity(
            @PathVariable Long id) {
        service.deleteUniversity(id);
        return ResponseEntity.noContent().build();
    }
}
