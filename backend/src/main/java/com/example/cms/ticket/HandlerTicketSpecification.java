package com.example.cms.ticket;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;

public class HandlerTicketSpecification implements Specification<Ticket> {
    private final Long userId;

    public HandlerTicketSpecification(Long userId) {
        this.userId = userId;
    }

    @Override
    public Predicate toPredicate(
            Root<Ticket> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        if (userId == null) {
            return criteriaBuilder.conjunction();
        }

        query.distinct(true);
        root.join("ticketHandlers");

        return criteriaBuilder.equal(root.join("ticketHandlers").get("user").get("id"), userId);
    }
}
