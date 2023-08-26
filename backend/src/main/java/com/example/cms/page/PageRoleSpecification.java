package com.example.cms.page;

import com.example.cms.SearchCriteria;
import com.example.cms.security.LoggedUser;
import com.example.cms.security.Role;
import com.example.cms.security.SecurityService;
import com.example.cms.university.University;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import static java.lang.Boolean.parseBoolean;
import static java.lang.Integer.parseInt;

@AllArgsConstructor
public class PageRoleSpecification implements Specification<Page> {

    private Role role;
    private Collection<Long> universities;
    private Long creator;

    @Override
    public Predicate toPredicate(Root<Page> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        List<Predicate> predicates = new ArrayList<>();

        Predicate conjunctionPred = criteriaBuilder.conjunction();

        if (this.role == null) {
            predicates.add(criteriaBuilder.and(
                    criteriaBuilder.equal(root.get("hidden"), false),
                    criteriaBuilder.equal(root.get("university").get("hidden"), false)
            ));
        } else if (!this.role.equals(Role.ADMIN)) {
            predicates.add(criteriaBuilder.and(
                    criteriaBuilder.equal(root.get("hidden"), false),
                    criteriaBuilder.equal(root.get("university").get("hidden"), false)
            ));

            if (this.creator != null && this.role.equals(Role.MODERATOR)) {
                predicates.add(root.get("university").get("id").in(universities));
            }

            if (this.universities != null && this.role.equals(Role.USER)) {
                predicates.add(criteriaBuilder.equal(root.get("creator").get("id"), creator));
            }
        }
        return criteriaBuilder.and(conjunctionPred,
                criteriaBuilder.or(predicates.toArray(new Predicate[0])));
    }
}
