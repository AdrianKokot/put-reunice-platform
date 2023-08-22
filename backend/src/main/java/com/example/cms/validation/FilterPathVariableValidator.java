package com.example.cms.validation;

import java.lang.reflect.Field;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.example.cms.file.FileResource;
import com.example.cms.template.Template;
import com.example.cms.user.User;

public class FilterPathVariableValidator {
    private static final Map<Class, Set<String>> forbiddenFields = Map.of(
            User.class, Set.of("password"),
            Template.class, Set.of("content"),
            FileResource.class, Set.of("page")
    );

    public static Map<String, String> validate(Map<String, String> vars, Class klass) {

        Set<String> klassFields = Stream.of(klass.getDeclaredFields())
                .map(Field::getName)
                .collect(Collectors.toSet());

        return vars.entrySet().stream()
                .filter(entry ->
                        klassFields.contains(entry.getKey().split("_")[0]) &&
                                !forbiddenFields.getOrDefault(klass, Set.of()).contains(entry.getKey().split("_")[0]))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }
}
