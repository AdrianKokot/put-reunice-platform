package put.eunice.cms.page.global;

import static java.lang.Boolean.parseBoolean;
import static java.lang.Integer.parseInt;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;
import put.eunice.cms.SearchCriteria;
import put.eunice.cms.SearchSpecification;

public class GlobalPageSpecification extends SearchSpecification
        implements Specification<GlobalPage> {

    public GlobalPageSpecification(SearchCriteria criteria) {
        super(criteria);
    }

    public static Specification<GlobalPage> empty() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.conjunction();
    }

    @Override
    public Predicate toPredicate(
            Root<GlobalPage> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {

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
        } else if (criteria.getOperation().equalsIgnoreCase("search")) {
            return this.searchPredicate(root, query, criteriaBuilder);
        }

        return criteriaBuilder.disjunction();
    }
}
