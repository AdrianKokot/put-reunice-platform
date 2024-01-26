package put.eunice.cms.user;

import static java.lang.Boolean.parseBoolean;
import static java.lang.Integer.parseInt;

import java.util.Set;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;
import put.eunice.cms.SearchCriteria;
import put.eunice.cms.SearchSpecification;
import put.eunice.cms.security.Role;

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
                        root.join("enrolledUniversities").get("id"), parseInt(criteria.getValue().toString()));
            }
        } else if (criteria.getOperation().equalsIgnoreCase("search")) {
            return criteriaBuilder.or(
                    this.searchPredicate(root, query, criteriaBuilder),
                    criteriaBuilder.like(
                            criteriaBuilder.lower(
                                    criteriaBuilder.concat(root.get("firstName"), root.get("lastName"))),
                            "%" + criteria.getValue().toString().toLowerCase().replace(' ', '%') + "%"));
        }
        return criteriaBuilder.disjunction();
    }
}
