package put.eunice.cms.page;

import java.util.*;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import put.eunice.cms.SearchCriteria;
import put.eunice.cms.page.exceptions.PageException;
import put.eunice.cms.page.exceptions.PageExceptionType;
import put.eunice.cms.page.exceptions.PageForbiddenException;
import put.eunice.cms.page.exceptions.PageNotFoundException;
import put.eunice.cms.page.projections.*;
import put.eunice.cms.resource.FileResourceRepository;
import put.eunice.cms.search.FullTextSearchService;
import put.eunice.cms.search.projections.PageSearchHitDto;
import put.eunice.cms.security.LoggedUser;
import put.eunice.cms.security.Role;
import put.eunice.cms.security.SecurityService;
import put.eunice.cms.ticket.TicketRepository;
import put.eunice.cms.university.University;
import put.eunice.cms.university.UniversityRepository;
import put.eunice.cms.user.User;
import put.eunice.cms.user.UserRepository;
import put.eunice.cms.user.exceptions.UserNotFoundException;
import put.eunice.cms.validation.exceptions.UnauthorizedException;

@Service
@RequiredArgsConstructor
public class PageService {
    private final FullTextSearchService<Page, PageSearchHitDto> searchService;
    private final PageRepository pageRepository;
    private final UniversityRepository universityRepository;
    private final UserRepository userRepository;
    private final SecurityService securityService;
    private final FileResourceRepository fileResourceRepository;
    private final TicketRepository ticketRepository;

    @Transactional
    public PageDtoDetailed get(Long id) {
        return pageRepository
                .findDetailedById(id)
                .map(
                        page -> {
                            if (!isPageVisible(page)) {
                                throw new PageNotFoundException();
                            }
                            if (!isPageVisible(page.getParent())) {
                                page.setParent(null);
                            }

                            PageDtoDetailed pageDto =
                                    PageDtoDetailed.of(
                                            page,
                                            pageRepository.hasPageResourcesReferencedOnlyByItself(page.getId()),
                                            findVisibleSubpages(
                                                    PageRequest.of(0, Integer.MAX_VALUE, Sort.by("title")), page));

                            if (securityService.isForbiddenPage(page)) {
                                pageDto.setContactRequestHandlers(null);
                            }

                            return pageDto;
                        })
                .orElseThrow(PageNotFoundException::new);
    }

    public org.springframework.data.domain.Page<Page> getAllVisible(
            Pageable pageable, Map<String, String> filterVars) {
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

        Specification<Page> combinedSpecification =
                Specification.where(new PageRoleSpecification(role, universities, creator));

        if (!filterVars.isEmpty()) {
            List<PageSpecification> specifications =
                    filterVars.entrySet().stream()
                            .map(
                                    entries -> {
                                        String[] filterBy = entries.getKey().split("_");

                                        return new PageSpecification(
                                                new SearchCriteria(
                                                        filterBy[0], filterBy[filterBy.length - 1], entries.getValue()));
                                    })
                            .collect(Collectors.toList());

            for (Specification<Page> spec : specifications) {
                combinedSpecification = combinedSpecification.and(spec);
            }
        }

        return pageRepository.findAll(combinedSpecification, pageable);
    }

    public List<PageDtoSimple> getCreatorPages(Pageable pageable, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);

        return pageRepository.findByCreator(pageable, user).stream()
                .filter(this::isPageVisible)
                .map(PageDtoSimple::of)
                .collect(Collectors.toList());
    }

    // TODO: Can be replaced with getAllVisible with given parent Id if null would be read as main
    public List<PageDtoSimple> getSubpagesByParentPage(Pageable pageable, Long parentId) {
        Page parent =
                Optional.ofNullable(parentId)
                        .map(id -> pageRepository.findById(id).orElseThrow(PageNotFoundException::new))
                        .orElse(null);

        return findVisibleSubpages(pageable, parent).stream()
                .map(PageDtoSimple::of)
                .collect(Collectors.toList());
    }

    private List<Page> findVisibleSubpages(Pageable pageable, Page page) {
        return pageRepository.findAllByParentAndHiddenFalseAndUniversityHiddenFalse(pageable, page);
    }

    private boolean isPageVisible(Page page) {
        return page != null
                && !((page.isHidden() || (page.getUniversity() != null && page.getUniversity().isHidden()))
                        && securityService.isForbiddenPage(page));
    }

    private Page save(Page page) {
        if (page.getUniversity() == null) throw new PageException(PageExceptionType.UNIVERSITY_EMPTY);

        if (page.getCreator() == null) throw new PageException(PageExceptionType.CREATOR_EMPTY);

        Page saved = pageRepository.save(page);
        searchService.upsert(saved);
        return saved;
    }

    private void delete(Page page) {
        pageRepository.delete(page);
        searchService.delete(page);
    }

    private boolean isCreatorValid(User creator, Page page) {
        if (securityService
                .getPrincipal()
                .orElseThrow(UnauthorizedException::new)
                .getId()
                .equals(creator.getId())) {
            return !securityService.isForbiddenPage(page);
        }

        return universityRepository.existsUniversityById_AndEnrolledUsers_Id(
                page.getUniversity().getId(), creator.getId());
    }

    @Secured("ROLE_USER")
    @Transactional
    public PageDtoDetailed save(PageDtoFormCreate form) {
        if (form.getParentId() == null) {
            throw new PageException(PageExceptionType.PARENT_NOT_FOUND);
        }

        Page parent =
                pageRepository.findById(form.getParentId()).orElseThrow(PageNotFoundException::new);
        if (securityService.isForbiddenPage(parent)) {
            throw new PageForbiddenException();
        }

        User creator =
                userRepository.findById(form.getCreatorId()).orElseThrow(UserNotFoundException::new);

        if (!isCreatorValid(creator, parent)) {
            throw new PageException(PageExceptionType.CREATOR_NOT_VALID);
        }

        Page newPage = new Page();
        newPage.setTitle(form.getTitle());
        newPage.setDescription(form.getDescription());
        newPage.setContent(Content.of(form.getContent()));
        newPage.setParent(parent);
        newPage.setUniversity(parent.getUniversity());
        newPage.setCreator(creator);
        newPage.setHidden(form.getHidden());

        return PageDtoDetailed.of(save(newPage), false);
    }

    @Secured("ROLE_USER")
    @Transactional
    public void update(Long id, PageDtoFormUpdate form) {
        Page page = pageRepository.findDetailedById(id).orElseThrow(PageNotFoundException::new);
        if (securityService.isForbiddenPage(page)) {
            throw new PageForbiddenException();
        }
        // Parent == null ? University main page
        if (page.getParent() == null && !securityService.hasHigherRoleThan(Role.USER)) {
            throw new PageForbiddenException();
        }

        page.setTitle(form.getTitle());
        page.setDescription(form.getDescription());
        page.setHidden(form.getHidden());
        page.setContent(Content.of(form.getContent()));

        if (form.getCreatorId() != null && !page.getCreator().getId().equals(form.getCreatorId())) {
            var creator =
                    userRepository.findById(form.getCreatorId()).orElseThrow(UserNotFoundException::new);
            if (!isCreatorValid(creator, page)) {
                throw new PageException(PageExceptionType.CREATOR_NOT_VALID);
            }
            page.setCreator(creator);
        }

        Set<User> usersToAssign = new HashSet<>();

        form.getContactRequestHandlers()
                .forEach(
                        userId -> {
                            User user = userRepository.findById(userId).orElse(null);
                            if (user == null) {
                                throw new UserNotFoundException(userId);
                            }

                            usersToAssign.add(user);
                        });

        page.setHandlers(usersToAssign);

        if (form.getResources() != null) {
            var resources = fileResourceRepository.findAllById(form.getResources());
            if (resources.size() != form.getResources().size()) {
                throw new PageException(PageExceptionType.RESOURCE_NOT_FOUND);
            }

            page.setResources(new HashSet<>(resources));
        }

        save(page);
    }

    @Secured("ROLE_USER")
    public void delete(Long id) {
        delete(id, false);
    }

    @Secured("ROLE_USER")
    @Transactional
    public void delete(Long id, boolean deleteStaleResources) {
        Page page = pageRepository.findDetailedById(id).orElseThrow(PageNotFoundException::new);

        if (securityService.isForbiddenPage(page)) {
            throw new PageForbiddenException();
        }

        if (pageRepository.existsByParent(page)) {
            throw new PageException(PageExceptionType.DELETING_WITH_CHILD);
        }

        if (deleteStaleResources) {
            fileResourceRepository.deleteAll(pageRepository.findResourcesReferencedOnlyByPage(id));
        }

        ticketRepository.deleteAllByPageId(id);

        delete(page);
    }

    public PageDtoHierarchy getHierarchy(long universityId) {
        University university =
                universityRepository.findById(universityId).orElseThrow(PageNotFoundException::new);
        return PageDtoHierarchy.of(university.getMainPage(), securityService);
    }
}
