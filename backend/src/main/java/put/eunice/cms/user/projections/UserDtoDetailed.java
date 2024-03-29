package put.eunice.cms.user.projections;

import java.time.Instant;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import put.eunice.cms.security.Role;
import put.eunice.cms.university.projections.UniversityDtoSimple;
import put.eunice.cms.user.User;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDtoDetailed {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String description;
    private Role accountType;
    private boolean enabled;
    private Instant lastLoginDate;
    private Set<UniversityDtoSimple> enrolledUniversities;

    public static UserDtoDetailed of(User user) {
        if (user == null) {
            return null;
        }
        return new UserDtoDetailed(user);
    }

    private UserDtoDetailed(User user) {
        id = user.getId();
        username = user.getUsername();
        firstName = user.getFirstName();
        lastName = user.getLastName();
        email = user.getEmail();
        phoneNumber = user.getPhoneNumber();
        accountType = user.getAccountType();
        description = user.getDescription();
        enabled = user.isEnabled();
        enrolledUniversities =
                user.getEnrolledUniversities().stream()
                        .map(UniversityDtoSimple::of)
                        .collect(Collectors.toSet());
        lastLoginDate = user.getLastLoginDate();
    }
}
