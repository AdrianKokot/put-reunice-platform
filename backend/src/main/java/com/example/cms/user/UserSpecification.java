package com.example.cms.user;

import static java.lang.Boolean.parseBoolean;
import static java.lang.Integer.parseInt;

import com.example.cms.SearchCriteria;
import com.example.cms.SearchSpecification;
import com.example.cms.security.Role;
import java.util.Set;
import javax.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

public class UserSpecification extends SearchSpecification implements Specification<User> {

    public UserSpecification(SearchCriteria criteria) {
        super(criteria);
    }

    @Override
    public Predicate toPredicate(
            Root<User> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {

        if (criteria.getOperation().equalsIgnoreCase("ct")) {
            if (root.get(criteria.getKey()).getJavaType() == String.class) {
                return criteriaBuilder.like(
                        criteriaBuilder.lower(root.get(criteria.getKey())),
                        "%" + criteria.getValue().toString().toLowerCase() + "%");
            }
        } else if (criteria.getOperation().equalsIgnoreCase("eq")) {
            if (root.get(criteria.getKey()).getJavaType() == String.class) {
                return criteriaBuilder.equal(root.<String>get(criteria.getKey()), criteria.getValue());
            }

            if (root.get(criteria.getKey()).getJavaType() == boolean.class) {
                return criteriaBuilder.equal(
                        root.<String>get(criteria.getKey()), parseBoolean(criteria.getValue().toString()));
            }

            if (root.get(criteria.getKey()).getJavaType() == Long.class) {
                return criteriaBuilder.equal(
                        root.<String>get(criteria.getKey()), parseInt(criteria.getValue().toString()));
            }

            if (root.get(criteria.getKey()).getJavaType() == Role.class) {
                try {
                    Role searchRole = Role.valueOf(criteria.getValue().toString().toUpperCase());
                    return criteriaBuilder.equal(root.<String>get(criteria.getKey()), searchRole);
                } catch (Exception e) {
                    return criteriaBuilder.disjunction();
                }
            }

            if (root.get(criteria.getKey()).getJavaType() == Set.class) {

                if (criteria.getKey().equalsIgnoreCase("handlersPages")) {
                    var join = root.join("handlersPages");

                    return criteriaBuilder.equal(join.get("id"), parseInt(criteria.getValue().toString()));
                }

                return criteriaBuilder.equal(
                        root.get("enrolledUniversities").get("id"), parseInt(criteria.getValue().toString()));
            }
        } else if (criteria.getOperation().equalsIgnoreCase("search")) {
            return this.searchPredicate(root, query, criteriaBuilder);
        }
        return criteriaBuilder.disjunction();
    }
}
