package put.eunice.cms.page.global;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Service;
import put.eunice.cms.SearchCriteria;
import put.eunice.cms.page.Content;
import put.eunice.cms.page.exceptions.PageException;
import put.eunice.cms.page.exceptions.PageExceptionType;
import put.eunice.cms.page.exceptions.PageNotFoundException;
import put.eunice.cms.page.global.projections.GlobalPageDtoDetailed;
import put.eunice.cms.page.global.projections.GlobalPageDtoFormCreate;
import put.eunice.cms.page.global.projections.GlobalPageDtoFormUpdate;
import put.eunice.cms.security.LoggedUser;
import put.eunice.cms.security.Role;
import put.eunice.cms.security.SecurityService;
import put.eunice.cms.validation.exceptions.UnauthorizedException;

@Service
@RequiredArgsConstructor
public class GlobalPageService {
    private final GlobalPageRepository pageRepository;
    private final SecurityService securityService;

    public void initializeMainPage() {
        if (pageRepository.findByIsLandingTrue().isEmpty()) {
            var page =
                    new GlobalPage(
                            "Landing page",
                            "<h1>Welcome to Eunice</h1><h2>Universities we work with</h2>",
                            false);
            page.setLanding(true);
            pageRepository.save(page);
        }
    }

    public GlobalPageDtoDetailed getLanding() {
        return pageRepository
                .findByIsLandingTrue()
                .map(GlobalPageDtoDetailed::of)
                .orElseThrow(PageNotFoundException::new);
    }

    public GlobalPageDtoDetailed get(Long id) {
        return pageRepository
                .findById(id)
                .map(
                        page -> {
                            if (!isPageVisible(page)) {
                                throw new PageNotFoundException();
                            }

                            return GlobalPageDtoDetailed.of(page);
                        })
                .orElseThrow(PageNotFoundException::new);
    }

    @Secured("ROLE_ADMIN")
    public org.springframework.data.domain.Page<GlobalPage> getAll(
            Pageable pageable, Map<String, String> filterVars) {

        LoggedUser loggedUser = securityService.getPrincipal().orElseThrow(UnauthorizedException::new);

        Specification<GlobalPage> combinedSpecification = GlobalPageSpecification.empty();

        if (!filterVars.isEmpty()) {
            List<GlobalPageSpecification> specifications =
                    filterVars.entrySet().stream()
                            .map(
                                    entries -> {
                                        String[] filterBy = entries.getKey().split("_");

                                        return new GlobalPageSpecification(
                                                new SearchCriteria(
                                                        filterBy[0], filterBy[filterBy.length - 1], entries.getValue()));
                                    })
                            .collect(Collectors.toList());

            for (Specification<GlobalPage> spec : specifications) {
                combinedSpecification = combinedSpecification.and(spec);
            }
        }

        return pageRepository.findAll(combinedSpecification, pageable);
    }

    private boolean isPageVisible(GlobalPage page) {
        return page != null
                && (!page.isHidden() || securityService.hasHigherOrEqualRoleThan(Role.ADMIN));
    }

    @Secured("ROLE_ADMIN")
    public GlobalPageDtoDetailed save(GlobalPageDtoFormCreate form) {
        GlobalPage newPage = new GlobalPage(form.getTitle(), form.getContent(), form.getHidden());

        return GlobalPageDtoDetailed.of(pageRepository.save(newPage));
    }

    @Secured("ROLE_ADMIN")
    public void update(Long id, GlobalPageDtoFormUpdate form) {
        var page = pageRepository.findById(id).orElseThrow(PageNotFoundException::new);
        page.setTitle(form.getTitle());

        if (page.isLanding() && form.getHidden()) {
            throw new PageException(PageExceptionType.CANNOT_HIDE_MAIN_PAGE);
        }

        page.setHidden(form.getHidden());
        page.setContent(Content.of(form.getContent()));
        pageRepository.save(page);
    }

    @Secured("ROLE_ADMIN")
    public void delete(Long id) {
        var page = pageRepository.findById(id).orElseThrow(PageNotFoundException::new);

        if (page.isLanding()) throw new PageException(PageExceptionType.CANNOT_DELETE_MAIN_PAGE);

        pageRepository.deleteById(id);
    }
}
