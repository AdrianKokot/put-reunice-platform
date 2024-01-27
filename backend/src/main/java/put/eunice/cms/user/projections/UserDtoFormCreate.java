package put.eunice.cms.user.projections;

import java.util.Set;
import lombok.Value;
import put.eunice.cms.security.Role;

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
