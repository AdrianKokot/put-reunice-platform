package com.example.cms.validation;

import com.example.cms.user.User;
import org.hibernate.annotations.Any;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class FilterPathVariableValidator {
    public static Map<String, String> validate(Map<String, String> vars, Class klass) {

        Set<String> klassFields = Stream.of(klass.getDeclaredFields())
                .map(Field::getName)
                .collect(Collectors.toSet());

        return vars.entrySet().stream()
                .filter(entry -> klassFields.contains(entry.getKey().split("_")[0]))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }
}
