package com.example.cms.page;

import com.example.cms.security.Role;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

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
            return criteriaBuilder.and(
                    criteriaBuilder.equal(root.get("hidden"), false),
                    criteriaBuilder.equal(root.get("university").get("hidden"), false)
            );
        }

        if (!this.role.equals(Role.ADMIN)) {
            predicates.add(root.get("university").get("id").in(universities));
        }

        if (this.role.equals(Role.USER)) {
            predicates.add(criteriaBuilder.equal(root.get("creator").get("id"), creator));
        }

        return predicates.isEmpty() ? conjunctionPred :  criteriaBuilder.and(conjunctionPred,
                criteriaBuilder.or(predicates.toArray(new Predicate[0])));
    }
}
