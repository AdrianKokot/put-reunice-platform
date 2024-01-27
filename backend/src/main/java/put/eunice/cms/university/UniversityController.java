package put.eunice.cms.university;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import put.eunice.cms.security.SecurityService;
import put.eunice.cms.university.projections.UniversityDtoDetailed;
import put.eunice.cms.university.projections.UniversityDtoFormCreate;
import put.eunice.cms.university.projections.UniversityDtoFormUpdate;
import put.eunice.cms.university.projections.UniversityDtoSimple;
import put.eunice.cms.validation.FilterPathVariableValidator;
import put.eunice.cms.validation.exceptions.UnauthorizedException;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "universities")
public class UniversityController {
    private final UniversityService service;
    private final SecurityService securityService;

    @GetMapping("/{id}")
    public ResponseEntity<UniversityDtoDetailed> getUniversity(@PathVariable long id) {

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("X-Whole-Content-Length", "1");

        return new ResponseEntity<>(service.getUniversity(id), httpHeaders, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<UniversityDtoSimple>> getUniversities(
            Pageable pageable, @RequestParam Map<String, String> vars) {

        Page<University> responsePage =
                service.getUniversities(
                        pageable, FilterPathVariableValidator.validate(vars, University.class));

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("X-Whole-Content-Length", String.valueOf(responsePage.getTotalElements()));

        return new ResponseEntity<>(
                responsePage.stream().map(UniversityDtoSimple::of).collect(Collectors.toList()),
                httpHeaders,
                HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<UniversityDtoDetailed> registerNewUniversity(
            @RequestBody UniversityDtoFormCreate form) {
        UniversityDtoDetailed result =
                service.addNewUniversity(
                        new UniversityDtoFormCreate(
                                form.getName(),
                                form.getShortName(),
                                form.getDescription(),
                                securityService.getPrincipal().orElseThrow(UnauthorizedException::new).getId(),
                                form.getAddress(),
                                form.getWebsite()));
        return ResponseEntity.created(URI.create("/" + result.getId())).body(result);
    }

    @PutMapping("/{universityId}")
    UniversityDtoDetailed updateUniversity(
            @PathVariable long universityId, @RequestBody UniversityDtoFormUpdate form) {
        return service.update(universityId, form);
    }

    @PostMapping("/{universityId}/image")
    public ResponseEntity<Void> uploadUniversityImage(
            @PathVariable long universityId, @RequestBody MultipartFile file) {
        service.uploadUniversityImage(universityId, file);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUniversity(@PathVariable Long id) {
        service.deleteUniversity(id);
        return ResponseEntity.noContent().build();
    }
}
