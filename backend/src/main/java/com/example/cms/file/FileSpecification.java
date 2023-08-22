package com.example.cms.file;

import com.example.cms.SearchCriteria;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;

import static java.lang.Boolean.parseBoolean;
import static java.lang.Integer.parseInt;

@AllArgsConstructor
public class FileSpecification implements Specification<FileResource> {
    private SearchCriteria criteria;
    private Long pageId;

    @Override
    public Predicate toPredicate(Root<FileResource> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        Predicate pageIdPredicate = criteriaBuilder.equal(root.get("page").get("id"), pageId);

        if (criteria.getOperation().equalsIgnoreCase("ct")) {
            if (root.get(criteria.getKey()).getJavaType() == String.class) {
                return criteriaBuilder.and(pageIdPredicate,
                        criteriaBuilder.like(
                        root.get(criteria.getKey()), "%" + criteria.getValue() + "%"));
            }
        } else if (criteria.getOperation().equalsIgnoreCase("eq")) {
            if (root.get(criteria.getKey()).getJavaType() == String.class) {
                return criteriaBuilder.and(pageIdPredicate,
                        criteriaBuilder.equal(
                        root.<String>get(criteria.getKey()), criteria.getValue()));
            } else if (root.get(criteria.getKey()).getJavaType() == Long.class) {
                return criteriaBuilder.and(pageIdPredicate,
                        criteriaBuilder.equal(
                        root.<String>get(criteria.getKey()), parseInt(criteria.getValue().toString())));
            }
        }
        return criteriaBuilder.disjunction();
    }
}
