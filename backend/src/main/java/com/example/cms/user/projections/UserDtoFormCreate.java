package com.example.cms.user.projections;

import com.example.cms.security.Role;
import lombok.Builder;
import lombok.Value;
import org.springframework.boot.context.properties.bind.DefaultValue;

import java.util.Set;

@Value
public class UserDtoFormCreate {
    String username;
    String password;
    String firstName;
    String lastName;
    String email;
    String phoneNumber;
    boolean enabled;
    Role accountType;
    Set<Long> enrolledUniversities;
}
