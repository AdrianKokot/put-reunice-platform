package com.example.cms.file;

import com.example.cms.security.LoggedUser;
import com.example.cms.security.Role;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
public class FileRoleSpecification implements Specification<FileResource> {

    private Role role;
    private Long userId;
    private List<Long> universities;

    @Override
    public Predicate toPredicate(Root<FileResource> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        List<Predicate> predicates = new ArrayList<>();

        Predicate conjunctionPred = criteriaBuilder.conjunction();

        if (this.role == null) {
            predicates.add(criteriaBuilder.and(
                    criteriaBuilder.equal(root.get("page").get("hidden"), false),
                    criteriaBuilder.equal(root.get("page").get("university").get("hidden"), false)
            ));
        } else if (this.role.equals(Role.USER)) {
            predicates.add(criteriaBuilder.equal(root.get("uploadedById"), this.userId));
        } else if (this.role.equals(Role.MODERATOR)) {
            predicates.add(root.get("page").get("university").get("id").in(universities));
        }

        return predicates.isEmpty() ? conjunctionPred : criteriaBuilder.and(conjunctionPred,
                criteriaBuilder.or(predicates.toArray(new Predicate[0])));
    }

    public static FileRoleSpecification of(Optional<LoggedUser> user) {
        return user.map(loggedUser -> new FileRoleSpecification(loggedUser.getAccountType(), loggedUser.getId(), loggedUser.getUniversities())).orElseGet(() -> new FileRoleSpecification(null, null, null));
    }
}
