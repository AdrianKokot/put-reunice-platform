package put.eunice.cms.resource;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import put.eunice.cms.SearchCriteria;
import put.eunice.cms.page.PageRepository;
import put.eunice.cms.resource.exceptions.FileNotFoundException;
import put.eunice.cms.resource.exceptions.ResourceException;
import put.eunice.cms.resource.exceptions.ResourceExceptionType;
import put.eunice.cms.resource.exceptions.ResourceNotFoundException;
import put.eunice.cms.resource.projections.ResourceDtoDetailed;
import put.eunice.cms.resource.projections.ResourceDtoFormCreate;
import put.eunice.cms.resource.projections.ResourceDtoFormUpdate;
import put.eunice.cms.security.Role;
import put.eunice.cms.security.SecurityService;
import put.eunice.cms.user.User;
import put.eunice.cms.user.UserRepository;
import put.eunice.cms.validation.exceptions.UnauthorizedException;

@Service
@RequiredArgsConstructor
public class FileResourceService {
    private final FileResourceRepository fileRepository;
    private final UserRepository userRepository;
    private final PageRepository pageRepository;
    private final SecurityService securityService;
    private final FileService fileService;

    @Secured("ROLE_USER")
    public ResourceDtoDetailed get(Long id) {
        return ResourceDtoDetailed.of(getAnonymous(id));
    }

    public FileResource getAnonymous(Long id) {
        return fileRepository.findById(id).orElseThrow(FileNotFoundException::new);
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
                        fileService.store(
                                form.getFile(), filename, FileResource.STORE_DIRECTORY + fileResource.getId());

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

    private void updateFileResourceToLinkResource(FileResource fileResource, String url) {
        try {
            fileService.deleteDirectory(FileResource.STORE_DIRECTORY + fileResource.getId());
        } catch (IOException e) {
            throw new ResourceException(ResourceExceptionType.FAILED_TO_UPDATE_FILE);
        }

        fileResource.setAsLinkResource(url);
    }

    private void updateLinkResourceToFileResource(
            FileResource fileResource, ResourceDtoFormUpdate form) {
        if (form.getFile() == null) {
            throw new ResourceException(ResourceExceptionType.FILE_EMPTY);
        }

        updateFileResource(fileResource, form);
    }

    private void updateLinkResource(FileResource fileResource, ResourceDtoFormUpdate form) {
        if (form.getUrl() != null) {
            fileResource.setPath(form.getUrl());
        } else {
            updateLinkResourceToFileResource(fileResource, form);
        }
    }

    private void updateFileResource(FileResource fileResource, ResourceDtoFormUpdate form) {
        if (form.getUrl() != null) {
            updateFileResourceToLinkResource(fileResource, form.getUrl());
        } else if (form.getFile() != null) {
            String tempDirectoryName = fileResource.getId().toString() + "_temp";
            try {
                fileService.renameDirectory(
                        FileResource.STORE_DIRECTORY + fileResource.getId().toString(),
                        FileResource.STORE_DIRECTORY + tempDirectoryName);

                var filename =
                        StringUtils.cleanPath(Objects.requireNonNull(form.getFile().getOriginalFilename()));
                var filePath =
                        fileService.store(
                                form.getFile(), filename, FileResource.STORE_DIRECTORY + fileResource.getId());

                fileResource.setAsFileResource(
                        filePath.toString(),
                        Objects.requireNonNull(form.getFile().getContentType()),
                        form.getFile().getSize());
                fileRepository.save(fileResource);
                fileService.deleteDirectory(FileResource.STORE_DIRECTORY + tempDirectoryName);
            } catch (IOException e) {
                try {
                    fileService.renameDirectory(
                            FileResource.STORE_DIRECTORY + tempDirectoryName,
                            FileResource.STORE_DIRECTORY + fileResource.getId().toString());
                } catch (IOException ex) {
                    throw new ResourceException(ResourceExceptionType.FAILED_TO_UPDATE_FILE);
                }
            }
        }
    }

    @Secured("ROLE_USER")
    @Transactional
    public ResourceDtoDetailed update(Long id, ResourceDtoFormUpdate form) {
        var principal = securityService.getPrincipal().orElseThrow(UnauthorizedException::new);

        if (!principal.getId().equals(form.getAuthorId())
                && !securityService.hasHigherRoleThan(Role.USER)) {
            throw new ResourceException(ResourceExceptionType.AUTHOR_NOT_VALID);
        }

        User author =
                userRepository
                        .findById(form.getAuthorId())
                        .orElseThrow(() -> new ResourceException(ResourceExceptionType.AUTHOR_NOT_VALID));

        var fileResource = fileRepository.findById(id).orElseThrow(FileNotFoundException::new);

        fileResource.setName(form.getName());
        fileResource.setDescription(form.getDescription());
        fileResource.setAuthor(author);

        if (fileResource.getResourceType() == ResourceType.LINK) {
            updateLinkResource(fileResource, form);
        } else {
            updateFileResource(fileResource, form);
        }

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

        return fileRepository.findAll(combinedSpecification, pageable);
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

        if (!file.getPages().isEmpty())
            throw new ResourceException(ResourceExceptionType.FILE_IS_USED_IN_PAGE);

        try {
            fileService.deleteDirectory(FileResource.STORE_DIRECTORY + file.getId());
        } catch (IOException e) {
            throw new ResourceException(ResourceExceptionType.FAILED_TO_DELETE_FILE);
        }

        fileRepository.deleteById(fileId);
    }
}
