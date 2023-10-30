package com.example.cms.file;

import com.example.cms.SearchCriteria;
import com.example.cms.file.exceptions.FileNotFound;
import com.example.cms.file.projections.FileDtoSimple;
import com.example.cms.page.Page;
import com.example.cms.page.PageRepository;
import com.example.cms.page.PageRoleSpecification;
import com.example.cms.page.exceptions.PageForbidden;
import com.example.cms.page.exceptions.PageNotFound;
import com.example.cms.security.LoggedUser;
import com.example.cms.security.Role;
import com.example.cms.security.SecurityService;
import com.example.cms.user.User;
import com.example.cms.user.UserRepository;
import com.example.cms.user.exceptions.UserNotFound;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileResourceService {
    private final FileResourceRepository fileRepository;
    private final UserRepository userRepository;
    private final PageRepository pageRepository;
    private final SecurityService securityService;

    @Secured("ROLE_USER")
    public FileResource get(Long fileId) {
        FileResource fileResource = fileRepository.findById(fileId).orElseThrow(FileNotFound::new);
        Page page = fileResource.getPage();
        if ((page.isHidden() || page.getUniversity().isHidden()) && securityService.isForbiddenPage(page)) {
            throw new PageForbidden();
        }

        return fileResource;
    }

    @Secured("ROLE_USER")
    @Transactional
    public void uploadFile(Long pageId, Long userId, MultipartFile multipartFile) throws IOException {

        Page page = pageRepository.findById(pageId).orElseThrow(PageNotFound::new);
        if (securityService.isForbiddenPage(page)) {
            throw new PageForbidden();
        }

        User user = userRepository.findById(userId).orElseThrow(UserNotFound::new);

        deleteFileIfExists(page, multipartFile);

        FileResource fileResource = prepareFileResource(page, user, multipartFile);

        fileRepository.save(fileResource);
    }

    public org.springframework.data.domain.Page<FileResource> getAll(Pageable pageable, Map<String, String> filterVars) {
        Specification<FileResource> combinedSpecification = Specification.where(FileRoleSpecification.of(securityService.getPrincipal()));

        if (!filterVars.isEmpty()) {
            List<FileSpecification> specifications = filterVars.entrySet().stream()
                    .map(entries -> {
                        String[] filterBy = entries.getKey().split("_");

                        return new FileSpecification(new SearchCriteria(
                                filterBy[0],
                                filterBy[filterBy.length - 1],
                                entries.getValue()));
                    }).collect(Collectors.toList());

            for (Specification<FileResource> spec : specifications) {
                combinedSpecification = combinedSpecification.and(spec);
            }
        }

        return fileRepository.findAll(combinedSpecification, pageable);
    }

    public org.springframework.data.domain.Page<FileResource> getAll(Pageable pageable, Long pageId, Map<String, String> filterVars) {
        Page page = pageRepository.findById(pageId).orElseThrow(PageNotFound::new);
        if ((page.isHidden() || page.getUniversity().isHidden()) && securityService.isForbiddenPage(page)) {
            throw new PageForbidden();
        }

        return this.getAll(pageable, new HashMap<>(filterVars) {{
            put("page_eq", String.valueOf(pageId));
        }});
    }

    @Transactional
    @Secured("ROLE_USER")
    public void deleteFile(Long fileId) {
        FileResource file = fileRepository.findById(fileId).orElseThrow(FileNotFound::new);

        if (securityService.isForbiddenPage(file.getPage())) {
            throw new PageForbidden();
        }

        fileRepository.deleteById(fileId);
    }

    protected void deleteFileIfExists(Page page, MultipartFile multipartFile) {
        Optional<FileResource> optionalFileResource = fileRepository.findFileResourceByFilenameAndPage(multipartFile.getOriginalFilename(), page);

        optionalFileResource.ifPresent(fileRepository::delete);
    }

    private static FileResource prepareFileResource(Page page, User user, MultipartFile multipartFile) throws IOException {
        FileResource fileResource = new FileResource();
        fileResource.setUploadDate(Timestamp.from(Instant.now()));
        fileResource.setUploadedBy(user.getUsername());
        fileResource.setUploadedById(user.getId());
        fileResource.setPage(page);
        fileResource.setFilename(StringUtils.cleanPath(Objects.requireNonNull(multipartFile.getOriginalFilename())));
        fileResource.setFileSize(multipartFile.getSize());
        fileResource.setFileType(multipartFile.getContentType());
        fileResource.setData(multipartFile.getBytes());

        return fileResource;
    }

    private static List<FileDtoSimple> prepareProjectionOutput(List<Object[]> objects) {
        List<FileDtoSimple> output = new ArrayList<>();
        for (Object[] object : objects) {
            output.add(new FileDtoSimple(object[0].toString(), object[1].toString(),
                    Long.parseLong(object[2].toString()), object[3].toString(), object[4].toString()));
        }
        return output;
    }

}
