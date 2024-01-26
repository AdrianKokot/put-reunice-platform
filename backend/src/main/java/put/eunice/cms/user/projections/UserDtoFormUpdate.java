package put.eunice.cms.user.projections;

import java.util.Set;
import lombok.Value;
import put.eunice.cms.security.Role;

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
