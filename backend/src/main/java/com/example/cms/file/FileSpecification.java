package com.example.cms.file;

import com.example.cms.SearchCriteria;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import static java.lang.Integer.parseInt;

@AllArgsConstructor
public class FileSpecification implements Specification<FileResource> {
    private SearchCriteria criteria;

    @Override
    public Predicate toPredicate(Root<FileResource> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        if (criteria.getOperation().equalsIgnoreCase("ct")) {
            if (root.get(criteria.getKey()).getJavaType() == String.class) {
                return criteriaBuilder.like(
                        criteriaBuilder.lower(root.get(criteria.getKey())), "%" + criteria.getValue().toString().toLowerCase() + "%");
            }
        } else if (criteria.getOperation().equalsIgnoreCase("eq")) {
            if (criteria.getKey().equalsIgnoreCase("page")) {
                return criteriaBuilder.equal(root.get("page").get("id"), parseInt(criteria.getValue().toString()));
            }

            if (root.get(criteria.getKey()).getJavaType() == String.class) {
                return criteriaBuilder.equal(root.<String>get(criteria.getKey()), criteria.getValue());
            } else if (root.get(criteria.getKey()).getJavaType() == Long.class) {
                return criteriaBuilder.equal(root.<String>get(criteria.getKey()), parseInt(criteria.getValue().toString()));
            }
        }
        return criteriaBuilder.disjunction();
    }
}
