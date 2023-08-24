package com.example.cms.university;

import com.example.cms.SearchCriteria;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;


import static java.lang.Boolean.parseBoolean;
import static java.lang.Integer.parseInt;

@AllArgsConstructor
public class UniversitySpecification implements Specification<University> {
    private SearchCriteria criteria;

    @Override
    public Predicate toPredicate(Root<University> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {

        if (criteria.getOperation().equalsIgnoreCase("ct")) {
            if (root.get(criteria.getKey()).getJavaType() == String.class) {
                return criteriaBuilder.like(
                        criteriaBuilder.lower(root.get(criteria.getKey())), "%" + criteria.getValue().toString().toLowerCase() + "%");
            }
        } else if (criteria.getOperation().equalsIgnoreCase("eq")) {
            if (root.get(criteria.getKey()).getJavaType() == String.class) {
                return criteriaBuilder.equal(
                        criteriaBuilder.lower(root.<String>get(criteria.getKey())), criteria.getValue().toString().toLowerCase());
            } else if (root.get(criteria.getKey()).getJavaType() == boolean.class || root.get(criteria.getKey()).getJavaType() == Boolean.class) {
                return criteriaBuilder.equal(
                        root.get(criteria.getKey()), Boolean.parseBoolean(criteria.getValue().toString()));
            } else if (root.get(criteria.getKey()).getJavaType() == Long.class) {
                return criteriaBuilder.equal(
                        root.get(criteria.getKey()), parseInt(criteria.getValue().toString()));
            }
        }
        return criteriaBuilder.disjunction();
    }
}
