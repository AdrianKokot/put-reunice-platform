package com.example.cms.file;

import com.example.cms.file.projections.FileDtoSimple;
import com.example.cms.security.SecurityService;
import com.example.cms.user.exceptions.UserNotFoundException;
import com.example.cms.validation.FilterPathVariableValidator;
import java.io.IOException;
import java.util.ArrayList;
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

@RestController
@RequiredArgsConstructor
@RequestMapping("/files")
public class FileResourceController {

    private final FileResourceService fileService;
    private final SecurityService securityService;

    @GetMapping()
    public ResponseEntity<List<FileDtoSimple>> getAll(
            Pageable pageable, @RequestParam Map<String, String> vars) {

        Page<FileResource> responsePage =
                fileService.getAll(
                        pageable, FilterPathVariableValidator.validate(vars, FileResource.class));

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("X-Whole-Content-Length", String.valueOf(responsePage.getTotalElements()));

        return new ResponseEntity<>(
                responsePage.stream().map(FileDtoSimple::of).collect(Collectors.toList()),
                httpHeaders,
                HttpStatus.OK);
    }

    @GetMapping("page/{pageId}")
    public ResponseEntity<List<FileDtoSimple>> getAllByPage(
            @PathVariable Long pageId, Pageable pageable, @RequestParam Map<String, String> vars) {

        Page<FileResource> responsePage =
                fileService.getAll(
                        pageable, pageId, FilterPathVariableValidator.validate(vars, FileResource.class));

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("X-Whole-Content-Length", String.valueOf(responsePage.getTotalElements()));

        return new ResponseEntity<>(
                responsePage.stream().map(FileDtoSimple::of).collect(Collectors.toList()),
                httpHeaders,
                HttpStatus.OK);
    }

    @GetMapping("{id}/download")
    public ResponseEntity<byte[]> downloadFiles(@PathVariable("id") Long fileId) {
        FileResource file = fileService.get(fileId);

        HttpHeaders headers = new HttpHeaders();

        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + file.getFilename());
        headers.add(HttpHeaders.CONTENT_TYPE, file.getFileType());
        headers.add(HttpHeaders.CONTENT_LENGTH, String.valueOf(file.getData().length));

        return ResponseEntity.ok().headers(headers).body(file.getData());
    }

    @PostMapping("upload")
    public ResponseEntity<List<String>> uploadFiles(
            @RequestParam("pageId") Long pageId,
            @RequestParam("files") List<MultipartFile> multipartFiles)
            throws IOException {
        Long userId = securityService.getPrincipal().orElseThrow(UserNotFoundException::new).getId();

        List<String> filenames = new ArrayList<>();
        for (MultipartFile file : multipartFiles) {
            filenames.add(file.getOriginalFilename());
            fileService.uploadFile(pageId, userId, file);
        }

        return ResponseEntity.ok().body(filenames);
    }

    @DeleteMapping("delete/{fileId}")
    public ResponseEntity<Void> deleteFile(@PathVariable("fileId") Long fileId) {
        fileService.deleteFile(fileId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("delete")
    public ResponseEntity<Void> deleteFileBulk(@RequestBody List<Long> ids) {
        ids.forEach(fileService::deleteFile);
        return ResponseEntity.noContent().build();
    }
}
