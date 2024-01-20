package com.example.cms.ticket;

import com.example.cms.ticketUserStatus.TicketUserStatus;
import java.time.LocalDateTime;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Subquery;
import org.springframework.data.jpa.domain.Specification;

public class UnseenTicketSpecification implements Specification<Ticket> {
    private final Long userId;

    public UnseenTicketSpecification(Long userId) {
        this.userId = userId;
    }

    @Override
    public Predicate toPredicate(
            Root<Ticket> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        if (userId == null) {
            return criteriaBuilder.conjunction();
        }

        Subquery<LocalDateTime> subquery = query.subquery(LocalDateTime.class);
        Root<TicketUserStatus> subRoot = subquery.from(TicketUserStatus.class);
        subquery.select(subRoot.get("lastSeenOn"));
        subquery.where(
                criteriaBuilder.equal(subRoot.get("user").get("id"), userId),
                criteriaBuilder.equal(subRoot.get("ticket").get("id"), root.get("id")));

        return criteriaBuilder.or(criteriaBuilder.lessThan(subquery, root.get("lastUpdateTime")));
    }
}
