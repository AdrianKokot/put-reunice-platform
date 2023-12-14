package com.example.cms.user.projections;

import com.example.cms.security.Role;
import java.util.Set;
import lombok.Value;

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
