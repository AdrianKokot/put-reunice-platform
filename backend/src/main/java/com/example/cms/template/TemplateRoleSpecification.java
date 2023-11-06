package com.example.cms.template;

import com.example.cms.security.Role;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.Collection;

@AllArgsConstructor
public class TemplateRoleSpecification implements Specification<Template> {

    private Role role;
    private Collection<Long> universities;

    @Override
    public Predicate toPredicate(Root<Template> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        if (this.role == null) {
            return criteriaBuilder.disjunction();
        }

        if (!this.role.equals(Role.ADMIN)) {
            return criteriaBuilder.or(
                    criteriaBuilder.equal(root.get("isAvailableToAll"), true),
                    root.get("universities").get("id").in(universities)
            );
        }

        return criteriaBuilder.conjunction();
    }
}
