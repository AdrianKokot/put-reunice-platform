package com.example.cms.university;

import com.example.cms.security.Role;
import com.example.cms.user.User;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import static java.lang.Integer.parseInt;

@AllArgsConstructor
public class UniversityRoleSpecification implements Specification<University> {

    private Role role;
    private Collection<Long> universities;

    @Override
    public Predicate toPredicate(Root<University> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        List<Predicate> predicates = new ArrayList<>();

        Predicate conjunctionPred = criteriaBuilder.conjunction();

        if (this.role == null) {
            predicates.add(criteriaBuilder.and(
                    criteriaBuilder.equal(root.get("hidden"), false)
            ));
        } else if (!this.role.equals(Role.ADMIN)) {
            predicates.add(criteriaBuilder.and(
                    criteriaBuilder.equal(root.get("hidden"), false)
            ));

            if (this.role.equals(Role.MODERATOR) || this.role.equals(Role.USER)) {
                predicates.add(root.get("id").in(universities));
            }
        }
        return predicates.isEmpty() ? conjunctionPred :  criteriaBuilder.and(conjunctionPred,
                criteriaBuilder.or(predicates.toArray(new Predicate[0])));
    }
}
