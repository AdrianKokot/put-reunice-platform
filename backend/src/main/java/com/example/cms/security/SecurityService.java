package com.example.cms.security;

import com.example.cms.page.Page;
import com.example.cms.university.University;
import com.example.cms.user.User;
import com.example.cms.validation.exceptions.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class SecurityService {
    private final SessionRegistry sessionRegistry;

    /**
     * Gets an optional which contains the currently logged user, or is empty (if the user is not logged in).
     *
     * @return an optional which contains the currently logged user, or is empty (if the user is not logged in)
     */
    public Optional<LoggedUser> getPrincipal() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof LoggedUser) {
            return Optional.of((LoggedUser) principal);
        } else {
            return Optional.empty();
        }
    }

    public void invalidateUserSession(Long id) {
        List<Object> loggedUsers = sessionRegistry.getAllPrincipals();
        for (Object principal : loggedUsers) {
            if (principal instanceof LoggedUser) {
                final LoggedUser loggedUser = (LoggedUser) principal;
                if (loggedUser.getId().equals(id)) {
                    List<SessionInformation> sessionsInfo = sessionRegistry.getAllSessions(principal, false);
                    if (sessionsInfo != null) {
                        for (SessionInformation sessionInformation : sessionsInfo) {
                            sessionInformation.expireNow();
                            log.info(String.format("User %d: session invalidated", id));
                        }
                    }
                }
            }
        }
    }

    public boolean isForbiddenPage(Page page) {
        return getPrincipal().map(loggedUser -> {
            switch (loggedUser.getAccountType()) {
                case ADMIN:
                    return false;
                case MODERATOR:
                    return !hasUniversity(page.getUniversity().getId());
                case USER:
                    return (!page.getCreator().getId().equals(loggedUser.getId()) &&
                            !hasUniversity(page.getUniversity().getId()));
            }
            return true;
        }).orElse(true);
    }

    public boolean isForbiddenUniversity(University university) {
        return getPrincipal().map(loggedUser -> {
            switch (loggedUser.getAccountType()) {
                case ADMIN:
                    return false;
                case MODERATOR:
                    return !hasUniversity(university.getId());
                case USER:
                    return true;
            }
            return true;
        }).orElse(true);
    }

    public boolean isForbiddenUser(User user, boolean onlyDifferentUser) {
        return getPrincipal().map(loggedUser -> {
            if (onlyDifferentUser && loggedUser.getId().equals(user.getId())) {
                return true;
            } else {
                return isForbiddenUser(user);
            }
        }).orElse(true);
    }

    public boolean isForbiddenUser(User user) {
        return getPrincipal().map(loggedUser -> {
            switch (loggedUser.getAccountType()) {
                case ADMIN:
                    return false;
                case MODERATOR:
                    return !loggedUser.getId().equals(user.getId()) && //moderator does not perform action with respect to him(her)self
                           (!hasHigherRoleThan(user.getAccountType()) ||
                            !hasUniversity(user.getEnrolledUniversities().stream()
                                    .map(University::getId)
                                    .collect(Collectors.toList())
                            )
                           );
                case USER:
                    return !loggedUser.getId().equals(user.getId());
            }
            return true;
        }).orElse(true);
    }

    /**
     * Establishes if currently logged used is a main administrator or is enrolled to at least one university identified by an ID from the given list of IDs.
     *
     * @param universities list of university identifiers
     * @return {@code true} if ID of the currently logged user's university is in the given list of university IDs, or if currently logged user is a main administrator,
     * {@code false} otherwise.
     */
    public boolean hasUniversity(List<Long> universities) {
        LoggedUser loggedUser = getPrincipal().orElseThrow(UnauthorizedException::new);

        boolean sameUniversity = false;
        for (long universityId : universities) {
            if (loggedUser.getUniversities().contains(universityId)) {
                sameUniversity = true;
                break;
            }
        }
        return loggedUser.getAccountType().equals(Role.ADMIN) || sameUniversity;
    }

    /**
     * Establishes if currently logged used is a main administrator or is enrolled the university identified by the given ID.
     *
     * @param universityId university identifier
     * @return {@code true} if the currently logged user is enrolled to the university with given ID, or if currently logged user is a main administrator,
     * {@code false} otherwise.
     */
    public boolean hasUniversity(Long universityId) {
        LoggedUser loggedUser = getPrincipal().orElseThrow(UnauthorizedException::new);
        return loggedUser.getAccountType().equals(Role.ADMIN) || loggedUser.getUniversities().contains(universityId);
    }

    /**
     * Tells if the first given role is higher that the second one.
     *
     * @param userRole users' role
     * @param role     reference role
     * @return {@code true} if the first given role (user's role) is higher that the second one,
     * {@code false} otherwise
     */
    public boolean hasHigherRoleThan(Role userRole, Role role) {
        switch (role) {
            case ADMIN:
            case MODERATOR:
                return userRole.equals(Role.ADMIN);
            case USER:
                return userRole.equals(Role.ADMIN) || userRole.equals(Role.MODERATOR);
        }
        return false;
    }

    /**
     * Tells if the role of the currently logged user is higher that the given role.
     *
     * @param role reference role
     * @return {@code true} if the role of the currently logged user is higher that the given one,
     * {@code false} otherwise
     */
    public boolean hasHigherRoleThan(Role role) {
        LoggedUser loggedUser = getPrincipal().orElseThrow(UnauthorizedException::new);
        return hasHigherRoleThan(loggedUser.getAccountType(), role);
    }
}
