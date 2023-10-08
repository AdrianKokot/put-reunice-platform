package com.example.cms.ticket;

import com.example.cms.SearchCriteria;
import com.example.cms.security.Role;
import com.example.cms.university.University;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.util.Set;
import java.util.UUID;

import static java.lang.Boolean.parseBoolean;
import static java.lang.Integer.parseInt;

@AllArgsConstructor
public class TicketSpecification implements Specification<Ticket> {

    private SearchCriteria criteria;

    @Override
    public Predicate toPredicate(Root<Ticket> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {

        if (criteria.getOperation().equalsIgnoreCase("ct")) {
            if (root.get(criteria.getKey()).getJavaType() == String.class) {
                return criteriaBuilder.like(criteriaBuilder.lower(root.get(criteria.getKey())), "%" + criteria.getValue().toString().toLowerCase() + "%");
            }
        } else if (criteria.getOperation().equalsIgnoreCase("eq")) {
            if (root.get(criteria.getKey()).getJavaType() == String.class) {
                return criteriaBuilder.equal(
                        root.<String>get(criteria.getKey()), criteria.getValue());
            } else if (root.get(criteria.getKey()).getJavaType() == boolean.class) {
                return criteriaBuilder.equal(
                        root.<String>get(criteria.getKey()), parseBoolean(criteria.getValue().toString()));
            } else if (root.get(criteria.getKey()).getJavaType() == Long.class) {
                return criteriaBuilder.equal(
                        root.<String>get(criteria.getKey()), parseInt(criteria.getValue().toString()));
            } else if (root.get(criteria.getKey()).getJavaType() == UUID.class) {
                return criteriaBuilder.equal(
                        root.<String>get(criteria.getKey()), criteria.getValue().toString());
            }
        }
        return criteriaBuilder.disjunction();
    }
}
