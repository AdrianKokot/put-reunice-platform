package com.example.cms.file;

import com.example.cms.file.exceptions.ResourceNotFoundException;
import com.example.cms.file.projections.ResourceDtoDetailed;
import com.example.cms.file.projections.ResourceDtoFormCreate;
import com.example.cms.file.projections.ResourceDtoFormUpdate;
import com.example.cms.file.projections.ResourceDtoSimple;
import com.example.cms.validation.FilterPathVariableValidator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/files")
public class FileResourceController {

    private final FileResourceService fileService;

    @GetMapping()
    public ResponseEntity<List<ResourceDtoSimple>> getAll(
            Pageable pageable, @RequestParam Map<String, String> vars) {

        Page<FileResource> responsePage =
                fileService.getAll(
                        pageable, FilterPathVariableValidator.validate(vars, FileResource.class));

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("X-Whole-Content-Length", String.valueOf(responsePage.getTotalElements()));

        return new ResponseEntity<>(
                responsePage.stream().map(ResourceDtoSimple::of).collect(Collectors.toList()),
                httpHeaders,
                HttpStatus.OK);
    }

    @GetMapping("page/{pageId}")
    public ResponseEntity<List<ResourceDtoSimple>> getAllByPage(
            @PathVariable Long pageId, Pageable pageable, @RequestParam Map<String, String> vars) {

        Page<FileResource> responsePage =
                fileService.getAll(
                        pageable, pageId, FilterPathVariableValidator.validate(vars, FileResource.class));

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("X-Whole-Content-Length", String.valueOf(responsePage.getTotalElements()));

        return new ResponseEntity<>(
                responsePage.stream().map(ResourceDtoSimple::of).collect(Collectors.toList()),
                httpHeaders,
                HttpStatus.OK);
    }

    @GetMapping("{id}")
    public ResponseEntity<ResourceDtoDetailed> get(@PathVariable("id") Long fileId) {
        return ResponseEntity.ok().body(fileService.get(fileId));
    }

    @GetMapping("{id}/download")
    public ResponseEntity<UrlResource> download(@PathVariable("id") Long fileId) {
        var resource = fileService.get(fileId);

        if (!resource.getResourceType().equals(ResourceType.FILE))
            throw new ResourceNotFoundException();

        var file = fileService.getFile(fileId);

        HttpHeaders headers = new HttpHeaders();

        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + file.getFilename());
        headers.add(HttpHeaders.CONTENT_TYPE, resource.getType());
        headers.add(HttpHeaders.CONTENT_LENGTH, String.valueOf(resource.getSize()));

        return ResponseEntity.ok().headers(headers).body(file);
    }

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<ResourceDtoDetailed> create(@ModelAttribute ResourceDtoFormCreate form) {
        var entity = fileService.create(form);
        return ResponseEntity.ok().body(entity);
    }

    @PutMapping(
            path = "{id}",
            consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Void> update(
            @PathVariable("id") Long id, @ModelAttribute ResourceDtoFormUpdate form) {
        fileService.update(id, form);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        fileService.deleteFile(id);
        return ResponseEntity.noContent().build();
    }
}
