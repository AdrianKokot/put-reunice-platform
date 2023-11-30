package com.example.cms.university;

import static java.lang.Boolean.parseBoolean;
import static java.lang.Integer.parseInt;

import com.example.cms.SearchCriteria;
import com.example.cms.SearchSpecification;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;

public class UniversitySpecification extends SearchSpecification
        implements Specification<University> {

    public UniversitySpecification(SearchCriteria criteria) {
        super(criteria);
    }

    @Override
    public Predicate toPredicate(
            Root<University> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        if (criteria.getOperation().equalsIgnoreCase("ct")) {
            if (root.get(criteria.getKey()).getJavaType() == String.class) {
                return criteriaBuilder.like(
                        criteriaBuilder.lower(root.get(criteria.getKey())),
                        "%" + criteria.getValue().toString().toLowerCase() + "%");
            }
        } else if (criteria.getOperation().equalsIgnoreCase("eq")) {
            if (root.get(criteria.getKey()).getJavaType() == String.class) {
                return criteriaBuilder.equal(
                        root.<String>get(criteria.getKey()), criteria.getValue());
            } else if (root.get(criteria.getKey()).getJavaType() == boolean.class) {
                return criteriaBuilder.equal(
                        root.<String>get(criteria.getKey()),
                        parseBoolean(criteria.getValue().toString()));
            } else if (root.get(criteria.getKey()).getJavaType() == Long.class) {
                return criteriaBuilder.equal(
                        root.<String>get(criteria.getKey()),
                        parseInt(criteria.getValue().toString()));
            }
        } else if (criteria.getOperation().equalsIgnoreCase("search")) {
            return this.searchPredicate(root, query, criteriaBuilder);
        }
        return criteriaBuilder.disjunction();
    }
}
