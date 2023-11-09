package com.example.cms.page;

import com.example.cms.SearchCriteria;
import com.example.cms.page.exceptions.PageException;
import com.example.cms.page.exceptions.PageExceptionType;
import com.example.cms.page.exceptions.PageForbidden;
import com.example.cms.page.exceptions.PageNotFound;
import com.example.cms.page.projections.*;
import com.example.cms.search.FullTextSearchService;
import com.example.cms.search.projections.PageSearchHitDto;
import com.example.cms.security.LoggedUser;
import com.example.cms.security.Role;
import com.example.cms.security.SecurityService;
import com.example.cms.university.University;
import com.example.cms.university.UniversityRepository;
import com.example.cms.user.User;
import com.example.cms.user.UserRepository;
import com.example.cms.user.exceptions.UserForbidden;
import com.example.cms.user.exceptions.UserNotFound;
import com.example.cms.validation.exceptions.WrongDataStructureException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PageService {
    private final FullTextSearchService<Page, PageSearchHitDto> searchService;
    private final PageRepository pageRepository;
    private final UniversityRepository universityRepository;
    private final UserRepository userRepository;
    private final SecurityService securityService;

    public PageDtoDetailed get(Long id) {
        return pageRepository.findById(id).map(page -> {
            if (!isPageVisible(page)) {
                throw new PageForbidden();
            }
            if (!isPageVisible(page.getParent())) {
                page.setParent(null);
            }

            PageDtoDetailed pageDto = PageDtoDetailed.of(page, findVisibleSubpages(PageRequest.of(0, Integer.MAX_VALUE, Sort.by("title")), page));

            if (securityService.isForbiddenPage(page)) {
                pageDto.setContactRequestHandlers(null);
            }

            return pageDto;
        }).orElseThrow(PageNotFound::new);
    }

    @Secured("ROLE_USER")
    public org.springframework.data.domain.Page<Page> getAllVisible(Pageable pageable, Map<String, String> filterVars) {
        Optional<LoggedUser> loggedUserOptional = securityService.getPrincipal();
        Role role;
        List<Long> universities;
        Long creator;

        if (loggedUserOptional.isPresent()) {
            LoggedUser loggedUser = loggedUserOptional.get();
            role = loggedUser.getAccountType();
            universities = loggedUser.getUniversities();
            creator = loggedUser.getId();
        } else {
            role = null;
            universities = null;
            creator = null;
        }

        Specification<Page> combinedSpecification = Specification.where(
                new PageRoleSpecification(role,
                        universities,
                        creator));

        if (!filterVars.isEmpty()) {
            List<PageSpecification> specifications = filterVars.entrySet().stream()
                    .map(entries -> {
                        String[] filterBy = entries.getKey().split("_");

                        return new PageSpecification(new SearchCriteria(
                                filterBy[0],
                                filterBy[filterBy.length - 1],
                                entries.getValue()));
                    }).collect(Collectors.toList());

            for (Specification<Page> spec : specifications) {
                combinedSpecification = combinedSpecification.and(spec);
            }
        }

        return pageRepository.findAll(combinedSpecification, pageable);
    }

    public List<PageDtoSimple> getCreatorPages(Pageable pageable, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(UserNotFound::new);

        return pageRepository.findByCreator(pageable, user).stream()
                .filter(this::isPageVisible)
                .map(PageDtoSimple::of)
                .collect(Collectors.toList());
    }

    public List<PageDtoSimple> getSubpagesByParentPage(Pageable pageable, Long parentId) {
        Page parent = Optional.ofNullable(parentId)
                .map(id -> pageRepository.findById(id).orElseThrow(PageNotFound::new))
                .orElse(null);

        return findVisibleSubpages(pageable, parent).stream()
                .map(PageDtoSimple::of)
                .collect(Collectors.toList());
    }

    private List<Page> findVisibleSubpages(Pageable pageable, Page page) {
        return pageRepository.findAllByParent(pageable, page).stream()
                .filter(this::isPageVisible)
                .collect(Collectors.toList());
    }

    private boolean isPageVisible(Page page) {
        return page != null && !((page.isHidden() || page.getUniversity().isHidden()) &&
                                 securityService.isForbiddenPage(page));
    }

    private Page save(Page page) {
        Page saved = pageRepository.save(page);
        searchService.upsert(saved);
        return saved;
    }

    private void delete(Page page) {
        pageRepository.delete(page);
        searchService.delete(page);
    }

    @Secured("ROLE_USER")
    public PageDtoDetailed save(PageDtoFormCreate form) {
        if (form.getParentId() == null) {
            throw new WrongDataStructureException();
        }

        Page parent = pageRepository.findById(form.getParentId()).orElseThrow(PageNotFound::new);
        if (parent.isHidden() && securityService.isForbiddenPage(parent)) {
            throw new PageForbidden();
        }

        User creator = userRepository.findById(form.getCreatorId()).orElseThrow(UserNotFound::new);
        if (securityService.isForbiddenUser(creator)) {
            throw new UserForbidden();
        }

        Page newPage = form.toPage(parent, creator);
        if (securityService.isForbiddenPage(newPage)) {
            throw new PageForbidden();
        }

        return PageDtoDetailed.of(save(newPage));
    }

    @Secured("ROLE_USER")
    public void update(Long id, PageDtoFormUpdate form) {
        Page page = pageRepository.findById(id).orElseThrow(PageNotFound::new);
        if (securityService.isForbiddenPage(page)) {
            throw new PageForbidden();
        }
        if (page.getParent() == null && !securityService.hasHigherRoleThan(Role.USER)) {
            throw new PageForbidden();
        }

        page.setTitle(form.getTitle());
        page.setDescription(form.getDescription());
        page.setHidden(form.getHidden());
        page.setContent(Content.of(form.getContent()));

        if(securityService.hasHigherRoleThan(Role.USER)) {
            page.setCreator(userRepository.findById(form.getCreatorId()).orElseThrow(UserNotFound::new));
        }

        Set<User> usersToAssign = new HashSet<>();

        form.getContactRequestHandlers().forEach(userId -> {
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                throw new UserNotFound(userId);
            }

            usersToAssign.add(user);
        });

        page.setHandlers(usersToAssign);
        save(page);
    }

    @Secured("ROLE_USER")
    public void modifyHiddenField(Long id, boolean hidden) {
        Page page = pageRepository.findById(id).orElseThrow(PageNotFound::new);
        if (securityService.isForbiddenPage(page)) {
            throw new PageForbidden();
        }

        page.setHidden(hidden);
        save(page);
    }

    @Secured("ROLE_USER")
    public void modifyContentField(Long id, String content) {
        Page page = pageRepository.findById(id).orElseThrow(PageNotFound::new);
        if (securityService.isForbiddenPage(page)) {
            throw new PageForbidden();
        }

        page.getContent().setPageContent(Optional.ofNullable(content).orElse(""));
        save(page);
    }

    @Secured("ROLE_MODERATOR")
    public void modifyCreatorField(Long id, String username) {
        Page page = pageRepository.findById(id).orElseThrow(PageNotFound::new);
        if (securityService.isForbiddenPage(page)) {
            throw new PageForbidden();
        }

        User creator = userRepository.findByUsername(username)
                .orElseThrow(UserNotFound::new);
        if (securityService.isForbiddenUser(creator)) {
            throw new UserForbidden();
        }

        page.setCreator(creator);
        save(page);
    }

    @Secured("ROLE_USER")
    public void modifyKeyWordsField(Long id, String keyWords) {
        Page page = pageRepository.findById(id).orElseThrow(PageNotFound::new);
        if (securityService.isForbiddenPage(page)) {
            throw new PageForbidden();
        }

        page.setKeyWords(keyWords);
        save(page);
    }

    @Secured("ROLE_USER")
    public void delete(Long id) {
        Page page = pageRepository.findById(id).orElseThrow(PageNotFound::new);
        if (securityService.isForbiddenPage(page)) {
            throw new PageForbidden();
        }

        if (pageRepository.existsByParent(page)) {
            throw new PageException(PageExceptionType.DELETING_WITH_CHILD);
        }

        delete(page);
    }

    public PageDtoHierarchy getHierarchy(long universityId) {
        University university = universityRepository.findById(universityId).orElseThrow(PageNotFound::new);
        return PageDtoHierarchy.of(university.getMainPage(), securityService);
    }

    @Secured({"ROLE_ADMIN", "ROLE_MODERATOR"})
    public void assignUsersToPage(List<Long> userIds, Long pageId) {
        com.example.cms.page.Page page = pageRepository.findById(pageId).orElse(null);

        if (page == null) {
            throw new PageNotFound();
        }

        Set<User> usersToAssign = new HashSet<>();

        userIds.forEach(id -> {
            User user = userRepository.findById(id).orElse(null);
            if (user == null) {
                throw new UserNotFound(id);
            }

            usersToAssign.add(user);
        });

        page.setHandlers(usersToAssign);
        pageRepository.save(page);
    }
}
