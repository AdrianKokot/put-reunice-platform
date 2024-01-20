package com.example.cms.file;

import static java.lang.Integer.parseInt;

import com.example.cms.SearchCriteria;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

@AllArgsConstructor
public class FileSpecification implements Specification<FileResource> {
    private SearchCriteria criteria;

    @Override
    public Predicate toPredicate(
            Root<FileResource> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        if (criteria.getOperation().equalsIgnoreCase("ct")) {
            if (root.get(criteria.getKey()).getJavaType() == String.class) {
                return criteriaBuilder.like(
                        criteriaBuilder.lower(root.get(criteria.getKey())),
                        "%" + criteria.getValue().toString().toLowerCase() + "%");
            }
        } else if (criteria.getOperation().equalsIgnoreCase("eq")) {
            if (criteria.getKey().equalsIgnoreCase("pages")) {
                return criteriaBuilder.equal(root.join("pages").get("id"), criteria.getValue());
            }

            if (criteria.getKey().equalsIgnoreCase("author")) {
                return criteriaBuilder.equal(root.get("author").get("id"), criteria.getValue());
            }

            if (criteria.getKey().equalsIgnoreCase("university")) {
                return criteriaBuilder.equal(
                        root.get("author").get("enrolledUniversities").get("id"), criteria.getValue());
            }

            if (root.get(criteria.getKey()).getJavaType() == String.class) {
                return criteriaBuilder.equal(root.<String>get(criteria.getKey()), criteria.getValue());
            } else if (root.get(criteria.getKey()).getJavaType() == Long.class) {
                return criteriaBuilder.equal(
                        root.<String>get(criteria.getKey()), parseInt(criteria.getValue().toString()));
            }
        }

        return criteriaBuilder.disjunction();
    }
}
