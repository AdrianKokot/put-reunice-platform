package com.example.cms.template;

import com.example.cms.security.Role;
import java.util.Collection;
import javax.persistence.criteria.*;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

@AllArgsConstructor
public class TemplateRoleSpecification implements Specification<Template> {

    private Role role;
    private Collection<Long> universities;

    @Override
    public Predicate toPredicate(
            Root<Template> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        if (this.role == null) {
            return criteriaBuilder.disjunction();
        }

        if (!this.role.equals(Role.ADMIN)) {
            return criteriaBuilder.or(
                    criteriaBuilder.equal(root.get("isAvailableToAll"), true),
                    root.join("universities", JoinType.LEFT).get("id").in(universities));
        }

        return criteriaBuilder.conjunction();
    }
}
