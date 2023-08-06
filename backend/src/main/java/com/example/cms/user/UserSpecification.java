package com.example.cms.user;

import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;

@AllArgsConstructor
public class UserSpecification implements Specification<User> {

    private SearchCriteria criteria;

    @Override
    public Predicate toPredicate(Root<User> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {

        if (criteria.getOperation().equalsIgnoreCase("ct")) {
            return criteriaBuilder.like(
                    root.get(criteria.getKey()), "%" + criteria.getValue() + "%");

        } else if (criteria.getOperation().equalsIgnoreCase("eq")) {
            return criteriaBuilder.equal(
                    root.<String>get(criteria.getKey()), criteria.getValue());
        }
        return null;
    }
}
