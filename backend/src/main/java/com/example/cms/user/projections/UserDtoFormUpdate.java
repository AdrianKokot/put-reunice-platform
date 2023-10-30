package com.example.cms.user.projections;

import com.example.cms.security.Role;
import lombok.Value;

import java.util.Set;

@Value
public class UserDtoFormUpdate {
    String firstName;
    String lastName;
    String email;
    String phoneNumber;
    String description;
    Set<Long> enrolledUniversities;
    boolean enabled;
    Role accountType;
    String username;
    String password;
}
