package put.eunice.cms;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import lombok.AllArgsConstructor;
import put.eunice.cms.validation.FilterPathVariableValidator;

@AllArgsConstructor
public abstract class SearchSpecification {
    protected SearchCriteria criteria;

    protected Predicate searchPredicate(
            Root<?> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        List<Predicate> predicates = new ArrayList<>();
        Set<String> possibleFields =
                FilterPathVariableValidator.classPossibleFields(root.getJavaType());

        possibleFields.forEach(
                (field -> {
                    if (root.get(field).getJavaType() == String.class) {
                        predicates.add(
                                criteriaBuilder.like(
                                        criteriaBuilder.lower(root.get(field)),
                                        "%" + criteria.getValue().toString().toLowerCase() + "%"));
                    }
                }));

        return predicates.isEmpty()
                ? criteriaBuilder.conjunction()
                : criteriaBuilder.and(
                        criteriaBuilder.conjunction(),
                        criteriaBuilder.or(predicates.toArray(new Predicate[0])));
    }
}
