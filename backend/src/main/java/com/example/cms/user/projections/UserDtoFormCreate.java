package com.example.cms.user.projections;

import com.example.cms.security.Role;
import java.util.Set;
import lombok.Value;

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
