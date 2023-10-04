package com.example.cms.ticket;

import com.example.cms.page.Page;
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
public class TicketRoleSpecification implements Specification<Ticket> {

    private Role role;
    private Collection<Long> handlesPages;
    private String email;

    @Override
    public Predicate toPredicate(Root<Ticket> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        List<Predicate> predicates = new ArrayList<>();

        Predicate conjunctionPred = criteriaBuilder.conjunction();

        if (this.role == null) {
            predicates.add(criteriaBuilder.disjunction());
        } else if (!this.role.equals(Role.ADMIN)) {
            if (this.handlesPages != null) {
                predicates.add(root.get("page").get("id").in(handlesPages));
            }

            if (this.email != null) {
                predicates.add(criteriaBuilder.equal(root.get("requesterEmail"), email));
            }
        }
        return predicates.isEmpty() ? conjunctionPred :  criteriaBuilder.and(conjunctionPred,
                criteriaBuilder.or(predicates.toArray(new Predicate[0])));
    }
}
