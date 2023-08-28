package com.example.cms.file;

import com.example.cms.file.projections.FileDtoSimple;
import com.example.cms.template.Template;
import com.example.cms.user.User;
import com.example.cms.validation.FilterPathVariableValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/file")
public class FileResourceController {

    private final FileResourceService fileService;

    @GetMapping("/all/page/{pageId}")
    public ResponseEntity<List<FileDtoSimple>> getAll(@PathVariable Long pageId, Pageable pageable, @RequestParam Map<String, String> vars) {

        Page<FileResource> responsePage = fileService.getAll(
                pageable,
                pageId,
                FilterPathVariableValidator.validate(vars, FileResource.class));

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("X-Whole-Content-Length", String.valueOf(responsePage.getTotalElements()));

        return new ResponseEntity<>(
                responsePage.stream().map(FileDtoSimple::of).collect(Collectors.toList()),
                httpHeaders,
                HttpStatus.OK);
    }

    @GetMapping("download/page/{pageId}/{filename}")
    public ResponseEntity<Resource> downloadFiles(@PathVariable("pageId") Long pageId, @PathVariable("filename") String filename) {
        return fileService.downloadFiles(pageId, filename);
    }

    @PostMapping("upload/page/{pageId}/user/{userId}")
    public ResponseEntity<List<String>> uploadFiles(@PathVariable("pageId") Long pageId, @PathVariable("userId") Long userId, @RequestParam("files") List<MultipartFile> multipartFiles) throws IOException {
        List<String> filenames = new ArrayList<>();
        for (MultipartFile file : multipartFiles) {
            filenames.add(file.getOriginalFilename());
            fileService.uploadFile(pageId, userId, file);
        }
        return ResponseEntity.ok().body(filenames);
    }

    @DeleteMapping("delete/page/{pageId}/{filename}")
    public ResponseEntity<Void> deleteFile(@PathVariable("pageId") Long pageId, @PathVariable("filename") String filename) {
        fileService.deleteFile(pageId, filename);
        return ResponseEntity.noContent().build();
    }
}
