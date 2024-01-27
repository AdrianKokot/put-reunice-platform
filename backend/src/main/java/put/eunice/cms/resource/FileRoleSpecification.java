package put.eunice.cms.resource;

import java.util.List;
import java.util.Optional;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import put.eunice.cms.security.LoggedUser;
import put.eunice.cms.security.Role;

@AllArgsConstructor
public class FileRoleSpecification implements Specification<FileResource> {

    private Role role;
    private List<Long> universities;

    @Override
    public Predicate toPredicate(
            Root<FileResource> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {

        if (this.role == null) {
            return criteriaBuilder.and(
                    criteriaBuilder.equal(root.join("pages").get("hidden"), false),
                    criteriaBuilder.equal(root.join("pages").get("university").get("hidden"), false));
        }

        if (!this.role.equals(Role.ADMIN)) {
            return root.join("author").join("enrolledUniversities").get("id").in(universities);
        }

        return criteriaBuilder.conjunction();
    }

    public static FileRoleSpecification of(Optional<LoggedUser> user) {
        return user.map(
                        loggedUser ->
                                new FileRoleSpecification(
                                        loggedUser.getAccountType(), loggedUser.getUniversities()))
                .orElseGet(() -> new FileRoleSpecification(null, null));
    }
}
