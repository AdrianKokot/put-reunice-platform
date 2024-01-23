package com.example.cms.resource;

import static java.lang.Integer.parseInt;

import com.example.cms.SearchCriteria;
import java.util.Set;
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
                return root.join("author")
                        .join("enrolledUniversities")
                        .get("id")
                        .in(Set.of(criteria.getValue()));
            }

            if (root.get(criteria.getKey()).getJavaType() == String.class) {
                return criteriaBuilder.equal(root.<String>get(criteria.getKey()), criteria.getValue());
            } else if (root.get(criteria.getKey()).getJavaType() == Long.class) {
                return criteriaBuilder.equal(
                        root.<String>get(criteria.getKey()), parseInt(criteria.getValue().toString()));
            }
        } else if (criteria.getOperation().equalsIgnoreCase("search")) {
            var likeValue = "%" + criteria.getValue().toString().toLowerCase() + "%";

            return criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), likeValue),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), likeValue),
                    criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("author").get("firstName")), likeValue),
                    criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("author").get("lastName")), likeValue),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("author").get("email")), likeValue),
                    criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("author").get("username")), likeValue));
        }

        return criteriaBuilder.disjunction();
    }
}
