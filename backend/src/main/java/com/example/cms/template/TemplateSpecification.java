package com.example.cms.template;

import com.example.cms.SearchCriteria;
import com.example.cms.SearchSpecification;
import com.example.cms.university.University;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.util.Set;

import static java.lang.Boolean.parseBoolean;
import static java.lang.Integer.parseInt;

public class TemplateSpecification extends SearchSpecification implements Specification<Template> {

    public TemplateSpecification(SearchCriteria criteria) {
        super(criteria);
    }

    @Override
    public Predicate toPredicate(Root<Template> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
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
            } else if (root.get(criteria.getKey()).getJavaType() == Set.class) {
                Join<Template, University> universityJoin = root.join("universities", JoinType.LEFT);

                Predicate predicateUniversity = criteriaBuilder.equal(
                        universityJoin.get("id"), parseInt(criteria.getValue().toString()));

                Predicate templateAvailableToAllUniversities = criteriaBuilder.isTrue(root.get("isAvailableToAll"));

                return criteriaBuilder.or(predicateUniversity, templateAvailableToAllUniversities);
            }
        } else if (criteria.getOperation().equalsIgnoreCase("search")) {
            return this.searchPredicate(root, query, criteriaBuilder);
        }
        return criteriaBuilder.disjunction();
    }
}
