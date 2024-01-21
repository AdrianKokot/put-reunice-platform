package com.example.cms.validation;

import com.example.cms.resource.FileResource;
import com.example.cms.template.Template;
import com.example.cms.ticket.Ticket;
import com.example.cms.user.User;
import java.lang.reflect.Field;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class FilterPathVariableValidator {
    private static final Map<Class, Set<String>> forbiddenFields =
            Map.of(
                    User.class, Set.of("password"),
                    Template.class, Set.of("content"),
                    FileResource.class, Set.of("size"),
                    Ticket.class, Set.of("page", "requesterToken"));

    private static final Set<String> extraFields = Set.of("search");

    public static Set<String> classPossibleFields(Class klass) {
        Set<String> classFields =
                Stream.concat(
                                Stream.of(klass.getDeclaredFields()),
                                klass.getSuperclass() != null
                                        ? Stream.of(klass.getSuperclass().getDeclaredFields())
                                        : Stream.empty())
                        .map(Field::getName)
                        .collect(Collectors.toSet());

        classFields.removeAll(forbiddenFields.getOrDefault(klass, Set.of()));

        return classFields;
    }

    public static Map<String, String> validate(
            Map<String, String> vars, Class klass, String... specificExtraFields) {
        Set<String> validFields = classPossibleFields(klass);
        validFields.addAll(extraFields);
        validFields.addAll(Set.of(specificExtraFields));

        return vars.entrySet().stream()
                .filter(entry -> validFields.contains(entry.getKey().split("_")[0]))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }
}
