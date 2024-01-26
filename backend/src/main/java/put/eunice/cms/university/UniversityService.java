package put.eunice.cms.university;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import put.eunice.cms.SearchCriteria;
import put.eunice.cms.page.PageRepository;
import put.eunice.cms.resource.FileService;
import put.eunice.cms.resource.FileUtils;
import put.eunice.cms.search.FullTextSearchService;
import put.eunice.cms.search.projections.PageSearchHitDto;
import put.eunice.cms.security.LoggedUser;
import put.eunice.cms.security.Role;
import put.eunice.cms.security.SecurityService;
import put.eunice.cms.template.TemplateRepository;
import put.eunice.cms.university.exceptions.UniversityException;
import put.eunice.cms.university.exceptions.UniversityExceptionType;
import put.eunice.cms.university.exceptions.UniversityForbiddenException;
import put.eunice.cms.university.exceptions.UniversityNotFoundException;
import put.eunice.cms.university.projections.UniversityDtoDetailed;
import put.eunice.cms.university.projections.UniversityDtoFormCreate;
import put.eunice.cms.university.projections.UniversityDtoFormUpdate;
import put.eunice.cms.user.User;
import put.eunice.cms.user.UserRepository;
import put.eunice.cms.user.exceptions.UserForbiddenException;
import put.eunice.cms.user.exceptions.UserNotFoundException;

@Service
@RequiredArgsConstructor
public class UniversityService {
    private final UniversityRepository universityRepository;
    private final UserRepository userRepository;
    private final PageRepository pageRepository;
    private final TemplateRepository templateRepository;
    private final SecurityService securityService;
    private final FileService fileService;
    private final FullTextSearchService<put.eunice.cms.page.Page, PageSearchHitDto> searchService;

    public UniversityDtoDetailed getUniversity(Long id) {
        return getUniversities(Pageable.ofSize(1), Map.of("id_eq", id.toString())).stream()
                .map(UniversityDtoDetailed::of)
                .findFirst()
                .orElseThrow(UniversityNotFoundException::new);
    }

    public Page<University> getUniversities(Pageable pageable, Map<String, String> filterVars) {
        Optional<LoggedUser> loggedUserOptional = securityService.getPrincipal();
        Role role;
        List<Long> universities;

        if (loggedUserOptional.isPresent()) {
            LoggedUser loggedUser = loggedUserOptional.get();
            role = loggedUser.getAccountType();
            universities = loggedUser.getUniversities();
        } else {
            role = null;
            universities = null;
        }

        Specification<University> combinedSpecification =
                Specification.where(new UniversityRoleSpecification(role, universities));

        if (!filterVars.isEmpty()) {
            List<UniversitySpecification> specifications =
                    filterVars.entrySet().stream()
                            .map(
                                    entries -> {
                                        String[] filterBy = entries.getKey().split("_");

                                        return new UniversitySpecification(
                                                new SearchCriteria(
                                                        filterBy[0], filterBy[filterBy.length - 1], entries.getValue()));
                                    })
                            .collect(Collectors.toList());

            for (Specification<University> spec : specifications) {
                combinedSpecification = combinedSpecification.and(spec);
            }
        }

        return universityRepository.findAll(combinedSpecification, pageable);
    }

    @Secured("ROLE_ADMIN")
    @Transactional
    public UniversityDtoDetailed addNewUniversity(UniversityDtoFormCreate form) {
        if (universityRepository.existsByNameOrShortName(form.getName(), form.getShortName())) {
            throw new UniversityException(UniversityExceptionType.NAME_TAKEN, "name");
        }

        User creator =
                userRepository.findById(form.getCreatorId()).orElseThrow(UserNotFoundException::new);

        if (creator.getAccountType() != Role.ADMIN) {
            throw new UserForbiddenException();
        }

        if (securityService.isForbiddenUser(creator)) {
            throw new UserForbiddenException();
        }

        String content = "";

        University newUniversity = form.toUniversity(creator, content);
        if (securityService.isForbiddenUniversity(newUniversity)) {
            throw new UniversityForbiddenException();
        }

        return UniversityDtoDetailed.of(universityRepository.save(newUniversity));
    }

    @Secured("ROLE_MODERATOR")
    public UniversityDtoDetailed update(Long id, UniversityDtoFormUpdate form) {
        University university =
                universityRepository.findById(id).orElseThrow(UniversityNotFoundException::new);
        if (securityService.isForbiddenUniversity(university)) {
            throw new UniversityForbiddenException();
        }

        var isVisibilityChanged = university.isHidden() != form.getHidden();

        form.updateUniversity(university);

        var result = UniversityDtoDetailed.of(universityRepository.save(university));

        if (isVisibilityChanged) {
            searchService.upsert(pageRepository.findAllByUniversityAndJoinLazyResources(university));
        }

        return result;
    }

    @Secured("ROLE_MODERATOR")
    public void uploadUniversityImage(Long id, MultipartFile file) {
        University university =
                universityRepository.findById(id).orElseThrow(UniversityNotFoundException::new);
        if (securityService.isForbiddenUniversity(university)) {
            throw new UniversityForbiddenException();
        }

        try {
            var filename =
                    university.getId()
                            + "_"
                            + Instant.now().toEpochMilli()
                            + "."
                            + FileUtils.getFileExtension(file);

            university.setImage(fileService.store(file, filename));
        } catch (Exception e) {
            throw new UniversityException(UniversityExceptionType.IMAGE_UPLOAD_FAILED);
        }

        universityRepository.save(university);
    }

    @Secured("ROLE_ADMIN")
    public void setUniversityImage(Long id, String image) {
        University university =
                universityRepository.findById(id).orElseThrow(UniversityNotFoundException::new);
        if (securityService.isForbiddenUniversity(university)) {
            throw new UniversityForbiddenException();
        }

        university.setImage(image);
        universityRepository.save(university);
    }

    @Transactional
    @Secured("ROLE_ADMIN") // TODO: remove UniversityService#enrollUsersToUniversity
    public UniversityDtoDetailed enrollUsersToUniversity(Long universityId, Long userId) {

        University university =
                universityRepository.findById(universityId).orElseThrow(UniversityNotFoundException::new);
        User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);

        university.enrollUsers(user);
        University result = universityRepository.save(university);
        return UniversityDtoDetailed.of(result);
    }

    @Secured("ROLE_ADMIN")
    @Transactional
    public void deleteUniversity(Long id) {
        University university =
                universityRepository.findById(id).orElseThrow(UniversityNotFoundException::new);
        if (securityService.isForbiddenUniversity(university)) {
            throw new UniversityForbiddenException();
        }

        validateForDelete(university);
        if (university.getMainPage() != null) pageRepository.delete(university.getMainPage());
        universityRepository.delete(university);
    }

    private void validateForDelete(University university) {
        if (!university.isHidden()) {
            throw new UniversityException(UniversityExceptionType.UNIVERSITY_IS_NOT_HIDDEN);
        }

        Set<User> enrolledUsers = university.getEnrolledUsers();
        for (User user : enrolledUsers) {
            if (user.isEnabled()) {
                throw new UniversityException(UniversityExceptionType.ACTIVE_USER_EXISTS);
            }
        }
    }
}
