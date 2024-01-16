package com.example.cms.ticket;

import static java.lang.Boolean.parseBoolean;
import static java.lang.Integer.parseInt;
import static java.lang.Long.parseLong;

import com.example.cms.SearchCriteria;
import java.util.UUID;
import javax.persistence.criteria.*;

import com.example.cms.SearchSpecification;
import org.springframework.data.jpa.domain.Specification;

public class TicketSpecification extends SearchSpecification implements Specification<Ticket> {

    public TicketSpecification(SearchCriteria criteria) {
        super(criteria);
    }

    @Override
    public Predicate toPredicate(
            Root<Ticket> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {

        if (criteria.getOperation().equalsIgnoreCase("ct")) {
            if (root.get(criteria.getKey()).getJavaType() == String.class) {
                return criteriaBuilder.like(
                        criteriaBuilder.lower(root.get(criteria.getKey())),
                        "%" + criteria.getValue().toString().toLowerCase() + "%");
            }
        } else if (criteria.getOperation().equalsIgnoreCase("eq")) {
            if (criteria.getKey().equalsIgnoreCase("pageId")) {
                return criteriaBuilder.equal(
                        root.get("page").get("id"),
                        parseLong(criteria.getValue().toString()));
            } else if (criteria.getKey().equalsIgnoreCase("universityId")) {
                return criteriaBuilder.equal(
                        root.get("page").get("university").get("id"),
                        parseLong(criteria.getValue().toString()));
            } else if (root.get(criteria.getKey()).getJavaType() == boolean.class) {
                return criteriaBuilder.equal(
                        root.<String>get(criteria.getKey()), parseBoolean(criteria.getValue().toString()));
            } else if (root.get(criteria.getKey()).getJavaType() == Long.class) {
                return criteriaBuilder.equal(
                        root.<String>get(criteria.getKey()), parseInt(criteria.getValue().toString()));
            } else if (root.get(criteria.getKey()).getJavaType() == UUID.class) {
                return criteriaBuilder.equal(
                        root.<String>get(criteria.getKey()), UUID.fromString(criteria.getValue().toString()));
            } else if (root.get(criteria.getKey()).getJavaType() == String.class) {
                return criteriaBuilder.equal(root.<String>get(criteria.getKey()), criteria.getValue());
            } else if (root.get(criteria.getKey()).getJavaType() == TicketStatus.class) {
                try {
                    return criteriaBuilder.equal(
                            root.<String>get(criteria.getKey()),
                            TicketStatus.valueOf(criteria.getValue().toString()));
                } catch (Exception e) {
                    return criteriaBuilder.disjunction();
                }
            }
        } else if (criteria.getOperation().equalsIgnoreCase("search")) {
            return this.searchPredicate(root, query, criteriaBuilder);
        }
        return criteriaBuilder.disjunction();
    }
}
