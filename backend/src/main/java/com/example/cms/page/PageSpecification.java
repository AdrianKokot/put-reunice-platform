package com.example.cms.page;

import com.example.cms.SearchCriteria;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.Collection;

import static java.lang.Integer.parseInt;

@AllArgsConstructor
public class PageSpecification implements Specification<Page> {

    private SearchCriteria criteria;
    private String role;
    private Collection<Long> universities;
    private Long creator;

    @Override
    public Predicate toPredicate(Root<Page> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
//        Predicate predicates = criteriaBuilder.and(criteriaBuilder.or(
//                criteriaBuilder.and(
//                        criteriaBuilder.equal(root.get("hidden"), false),
//                        criteriaBuilder.equal(root.get("university").get("hidden"), false)
//                )));

//        if (this.role != null) {
//            predicates = criteriaBuilder.and(predicates,
//                    criteriaBuilder.equal(criteriaBuilder.literal(role), "ADMIN"));
//
//            if (this.creator != null) {
//                predicates = criteriaBuilder.and(predicates,
//                        criteriaBuilder.and(
//                                criteriaBuilder.equal(criteriaBuilder.literal(role), "MODERATOR"),
//                                root.get("university").get("id").in(universities)));
//            }
//
//            if (this.universities != null) {
//                predicates = criteriaBuilder.and(predicates,
//                        criteriaBuilder.and(
//                                criteriaBuilder.equal(criteriaBuilder.literal(role), "USER"),
//                                criteriaBuilder.equal(root.get("creator").get("id"), creator)));
//            }
//        }

        if (criteria.getOperation().equalsIgnoreCase("ct")) {
            if (root.get(criteria.getKey()).getJavaType() == String.class) {
                return criteriaBuilder.and(
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get(criteria.getKey())), "%" + criteria.getValue().toString().toLowerCase() + "%"));
            }
        } else if (criteria.getOperation().equalsIgnoreCase("eq")) {
            if (criteria.getKey().equalsIgnoreCase("university")) {
                return criteriaBuilder.and(
                        criteriaBuilder.equal(root.get("university").get("id"), criteria.getValue()));
            } else if (criteria.getKey().equalsIgnoreCase("creator")) {
                return criteriaBuilder.and(
                        criteriaBuilder.equal(root.get("creator").get("id"), criteria.getValue()));
            } else if (root.get(criteria.getKey()).getJavaType() == String.class) {
                return criteriaBuilder.and(
                        criteriaBuilder.equal(
                                root.<String>get(criteria.getKey()), criteria.getValue()));
            } else if (root.get(criteria.getKey()).getJavaType() == boolean.class || root.get(criteria.getKey()).getJavaType() == Boolean.class) {
                return criteriaBuilder.and(
                        criteriaBuilder.equal(
                                root.<String>get(criteria.getKey()), Boolean.parseBoolean(criteria.getValue().toString())));
            } else if (root.get(criteria.getKey()).getJavaType() == Long.class) {
                return criteriaBuilder.equal(
                        root.<String>get(criteria.getKey()), parseInt(criteria.getValue().toString()));
            }
        }
        return criteriaBuilder.disjunction();
    }
}
