package com.example.cms.university;

import com.example.cms.SearchCriteria;
import com.example.cms.file.FileService;
import com.example.cms.page.PageRepository;
import com.example.cms.security.LoggedUser;
import com.example.cms.security.Role;
import com.example.cms.security.SecurityService;
import com.example.cms.template.Template;
import com.example.cms.template.TemplateRepository;
import com.example.cms.university.exceptions.UniversityException;
import com.example.cms.university.exceptions.UniversityExceptionType;
import com.example.cms.university.exceptions.UniversityForbiddenException;
import com.example.cms.university.exceptions.UniversityNotFoundException;
import com.example.cms.university.projections.UniversityDtoDetailed;
import com.example.cms.university.projections.UniversityDtoFormCreate;
import com.example.cms.university.projections.UniversityDtoFormUpdate;
import com.example.cms.user.User;
import com.example.cms.user.UserRepository;
import com.example.cms.user.exceptions.UserForbiddenException;
import com.example.cms.user.exceptions.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UniversityService {
    private final UniversityRepository universityRepository;
    private final UserRepository userRepository;
    private final PageRepository pageRepository;
    private final TemplateRepository templateRepository;
    private final SecurityService securityService;
    private final FileService fileService;

    public UniversityDtoDetailed getUniversity(Long id) {
        return universityRepository.findById(id).map(university -> {
            if (!isUniversityVisible(university)) {
                throw new UniversityForbiddenException();
            }

            return UniversityDtoDetailed.of(university);
        }).orElseThrow(UniversityNotFoundException::new);
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

        Specification<University> combinedSpecification = Specification.where(
                new UniversityRoleSpecification(role,
                        universities));


        if (!filterVars.isEmpty()) {
            List<UniversitySpecification> specifications = filterVars.entrySet().stream()
                    .map(entries -> {
                        String[] filterBy = entries.getKey().split("_");

                        return new UniversitySpecification(new SearchCriteria(
                                filterBy[0],
                                filterBy[filterBy.length - 1],
                                entries.getValue()
                        ));
                    }).collect(Collectors.toList());

            for (Specification<University> spec : specifications) {
                combinedSpecification = combinedSpecification.and(spec);
            }
        }

        return universityRepository.findAll(combinedSpecification, pageable);
    }

    private boolean isUniversityVisible(University university) {
        return university != null && !(university.isHidden() && securityService.isForbiddenUniversity(university));
    }

    @Secured("ROLE_ADMIN")
    public UniversityDtoDetailed addNewUniversity(UniversityDtoFormCreate form) {
        if (universityRepository.existsByNameOrShortName(form.getName(), form.getShortName())) {
            throw new UniversityException(UniversityExceptionType.NAME_TAKEN, "name");
        }

        User creator = userRepository.findById(form.getCreatorId())
                .orElseThrow(UserNotFoundException::new);

        if (creator.getAccountType() != Role.ADMIN) {
            throw new UserForbiddenException();
        }

        if (securityService.isForbiddenUser(creator)) {
            throw new UserForbiddenException();
        }

        String content = templateRepository.findByName("UniversityTemplate")
                .map(Template::getContent).orElse("Default university page content");

        University newUniversity = form.toUniversity(creator, content);
        if (securityService.isForbiddenUniversity(newUniversity)) {
            throw new UniversityForbiddenException();
        }

        return UniversityDtoDetailed.of(universityRepository.save(newUniversity));
    }

    @Secured("ROLE_MODERATOR")
    public UniversityDtoDetailed update(Long id, UniversityDtoFormUpdate form) {
        University university = universityRepository.findById(id).orElseThrow(UniversityNotFoundException::new);
        if (securityService.isForbiddenUniversity(university)) {
            throw new UniversityForbiddenException();
        }

        form.updateUniversity(university);

        return UniversityDtoDetailed.of(universityRepository.save(university));
    }

    @Secured("ROLE_MODERATOR")
    public void uploadUniversityImage(Long id, MultipartFile file) {
        University university = universityRepository.findById(id).orElseThrow(UniversityNotFoundException::new);
        if (securityService.isForbiddenUniversity(university)) {
            throw new UniversityForbiddenException();
        }

        try {
            var filename = university.getId() + "_" + Instant.now().toEpochMilli() + (file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.')));

            university.setImage(fileService.store(file, filename));
        } catch (Exception e) {
            throw new UniversityException(UniversityExceptionType.IMAGE_UPLOAD_FAILED);
        }

        universityRepository.save(university);
    }

    @Transactional
    @Secured("ROLE_ADMIN") // TODO: remove UniversityService#enrollUsersToUniversity
    public UniversityDtoDetailed enrollUsersToUniversity(Long universityId, Long userId) {

        University university = universityRepository.findById(universityId).orElseThrow(UniversityNotFoundException::new);
        User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);

        university.enrollUsers(user);
        University result = universityRepository.save(university);
        return UniversityDtoDetailed.of(result);
    }

    @Secured("ROLE_MODERATOR")
    public void modifyHiddenField(Long id, boolean hidden) {
        University university = universityRepository.findById(id).orElseThrow(UniversityNotFoundException::new);
        if (securityService.isForbiddenUniversity(university)) {
            throw new UniversityForbiddenException();
        }

        university.setHidden(hidden);
        universityRepository.save(university);
    }

    @Secured("ROLE_ADMIN")
    @Transactional
    public void deleteUniversity(Long id) {
        University university = universityRepository.findById(id).orElseThrow(UniversityNotFoundException::new);
        if (securityService.isForbiddenUniversity(university)) {
            throw new UniversityForbiddenException();
        }

        validateForDelete(university);
        pageRepository.delete(university.getMainPage());
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
