package com.example.cms.ticket;

import com.example.cms.ticketUserStatus.TicketUserStatus;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.time.LocalDateTime;

public class UnseenTicketSpecification implements Specification<Ticket> {
    private final Long userId;

    public UnseenTicketSpecification(Long userId) {
        this.userId = userId;
    }
    @Override
    public Predicate toPredicate(Root<Ticket> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        if (userId == null) {
            return criteriaBuilder.conjunction();
        }

        Subquery<LocalDateTime> subquery = query.subquery(LocalDateTime.class);
        Root<TicketUserStatus> subRoot = subquery.from(TicketUserStatus.class);
        subquery.select(subRoot.get("lastSeenOn"));
        subquery.where(criteriaBuilder.equal(subRoot.get("user").get("id"), userId),
                criteriaBuilder.equal(subRoot.get("ticket").get("id"), root.get("id")));

        return criteriaBuilder.lessThan(subquery, root.get("lastUpdateTime"));
    }
}
