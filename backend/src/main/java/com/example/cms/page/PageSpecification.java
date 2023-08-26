package com.example.cms.page;

import com.example.cms.SearchCriteria;
import com.example.cms.security.LoggedUser;
import com.example.cms.security.Role;
import com.example.cms.security.SecurityService;
import com.example.cms.university.University;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import static java.lang.Boolean.parseBoolean;
import static java.lang.Integer.parseInt;

@AllArgsConstructor
public class PageSpecification implements Specification<Page> {

    private SearchCriteria criteria;

    @Override
    public Predicate toPredicate(Root<Page> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {

        if (criteria.getOperation().equalsIgnoreCase("ct")) {
            if (root.get(criteria.getKey()).getJavaType() == String.class) {
                return criteriaBuilder.like(root.get(criteria.getKey()), "%" + criteria.getValue() + "%");
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

            }
        }
        return criteriaBuilder.disjunction();
    }
}
