package com.example.cms.file;

import com.example.cms.SearchCriteria;
import com.example.cms.file.exceptions.FileNotFoundException;
import com.example.cms.file.exceptions.ResourceException;
import com.example.cms.file.exceptions.ResourceExceptionType;
import com.example.cms.file.exceptions.ResourceNotFoundException;
import com.example.cms.file.projections.ResourceDtoDetailed;
import com.example.cms.file.projections.ResourceDtoFormCreate;
import com.example.cms.file.projections.ResourceDtoFormUpdate;
import com.example.cms.page.PageRepository;
import com.example.cms.security.Role;
import com.example.cms.security.SecurityService;
import com.example.cms.user.User;
import com.example.cms.user.UserRepository;
import com.example.cms.validation.exceptions.UnauthorizedException;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class FileResourceService {
    private final FileResourceRepository fileRepository;
    private final UserRepository userRepository;
    private final PageRepository pageRepository;
    private final SecurityService securityService;
    private final FileService fileService;
    private static final String FILE_DIRECTORY = "files/";

    @Secured("ROLE_USER")
    public ResourceDtoDetailed get(Long id) {
        var resource = fileRepository.findById(id).orElseThrow(FileNotFoundException::new);

        return ResourceDtoDetailed.of(resource);
    }

    public UrlResource getFile(Long id) {
        var resource = fileRepository.findById(id).orElseThrow(FileNotFoundException::new);

        try {
            return new UrlResource(Paths.get(resource.getPath()).toUri());
        } catch (IOException e) {
            throw new ResourceNotFoundException();
        }
    }

    @Secured("ROLE_USER")
    @Transactional
    public ResourceDtoDetailed create(ResourceDtoFormCreate form) {
        var principal = securityService.getPrincipal().orElseThrow(UnauthorizedException::new);

        if (!principal.getId().equals(form.getAuthorId())
                && !securityService.hasHigherRoleThan(Role.USER)) {
            throw new ResourceException(ResourceExceptionType.AUTHOR_NOT_VALID);
        }

        User author =
                userRepository
                        .findById(form.getAuthorId())
                        .orElseThrow(() -> new ResourceException(ResourceExceptionType.AUTHOR_NOT_VALID));

        FileResource fileResource = new FileResource(form.getName(), form.getDescription(), author);

        fileResource = fileRepository.save(fileResource);

        if (form.getFile() == null) {
            fileResource.setAsLinkResource(form.getUrl());
        } else {
            try {
                var filename =
                        StringUtils.cleanPath(Objects.requireNonNull(form.getFile().getOriginalFilename()));
                var filePath =
                        fileService.store(form.getFile(), filename, FILE_DIRECTORY + fileResource.getId());

                fileResource.setAsFileResource(
                        filePath.toString(),
                        Objects.requireNonNull(form.getFile().getContentType()),
                        form.getFile().getSize());
            } catch (IOException e) {
                throw new ResourceException(ResourceExceptionType.FAILED_TO_STORE_FILE);
            }
        }

        return ResourceDtoDetailed.of(fileRepository.save(fileResource));
    }

    @Secured("ROLE_USER")
    @Transactional
    public ResourceDtoDetailed update(Long id, ResourceDtoFormUpdate form) {
        var fileResource = fileRepository.findById(id).orElseThrow(FileNotFoundException::new);
        //        var principal =
        // securityService.getPrincipal().orElseThrow(UnauthorizedException::new);
        //
        //        if (!principal.getId().equals(form.getAuthorId())
        //            && !securityService.hasHigherRoleThan(Role.USER)) {
        //            throw new ResourceException(ResourceExceptionType.AUTHOR_NOT_VALID);
        //        }
        //
        //        User author =
        //                userRepository
        //                        .findById(form.getAuthorId())
        //                        .orElseThrow(() -> new
        // ResourceException(ResourceExceptionType.AUTHOR_NOT_VALID));
        //
        //        if (form.getFile() == null) {
        //            fileResource.setAsLinkResource(form.getUrl());
        //        } else {
        //            try {
        //                var filename =
        //
        // StringUtils.cleanPath(Objects.requireNonNull(form.getFile().getOriginalFilename()));
        //                var filePath =
        //                        fileService.store(form.getFile(), filename, FILE_DIRECTORY +
        // fileResource.getId());
        //
        //                fileResource.setAsFileResource(
        //                        filePath.toString(),
        //                        Objects.requireNonNull(form.getFile().getContentType()),
        //                        form.getFile().getSize());
        //            } catch (IOException e) {
        //                throw new ResourceException(ResourceExceptionType.FAILED_TO_STORE_FILE);
        //            }
        //        }

        return ResourceDtoDetailed.of(fileRepository.save(fileResource));
    }

    private org.springframework.data.domain.Page<FileResource> _getAll(
            Pageable pageable, Map<String, String> filterVars) {
        Specification<FileResource> combinedSpecification =
                Specification.where(FileRoleSpecification.of(securityService.getPrincipal()));

        if (!filterVars.isEmpty()) {
            List<FileSpecification> specifications =
                    filterVars.entrySet().stream()
                            .map(
                                    entries -> {
                                        String[] filterBy = entries.getKey().split("_");

                                        return new FileSpecification(
                                                new SearchCriteria(
                                                        filterBy[0], filterBy[filterBy.length - 1], entries.getValue()));
                                    })
                            .collect(Collectors.toList());

            for (Specification<FileResource> spec : specifications) {
                combinedSpecification = combinedSpecification.and(spec);
            }
        }

        //        return fileRepository.findAll(combinedSpecification, pageable);
        return fileRepository.findAll(pageable);
    }

    @Secured("ROLE_USER")
    public org.springframework.data.domain.Page<FileResource> getAll(
            Pageable pageable, Map<String, String> filterVars) {
        return this._getAll(pageable, filterVars);
    }

    public org.springframework.data.domain.Page<FileResource> getAll(
            Pageable pageable, Long pageId, Map<String, String> filterVars) {
        var optionalPage = pageRepository.findById(pageId);

        if (optionalPage
                .map(
                        page ->
                                (page.isHidden() || page.getUniversity().isHidden())
                                        && securityService.isForbiddenPage(page))
                .orElse(true)) {
            return org.springframework.data.domain.Page.empty();
        }

        return this._getAll(
                pageable,
                new HashMap<>(filterVars) {
                    {
                        put("pages_eq", String.valueOf(pageId));
                    }
                });
    }

    @Transactional
    @Secured("ROLE_USER")
    public void deleteFile(Long fileId) {
        FileResource file = fileRepository.findById(fileId).orElseThrow(FileNotFoundException::new);

        try {

            fileService.deleteDirectory(FILE_DIRECTORY + file.getId());
        } catch (IOException e) {
            throw new ResourceException(ResourceExceptionType.FAILED_TO_DELETE_FILE);
        }

        fileRepository.deleteById(fileId);
    }
}
