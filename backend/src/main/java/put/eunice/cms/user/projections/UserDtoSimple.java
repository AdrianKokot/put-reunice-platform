package put.eunice.cms.user.projections;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import put.eunice.cms.security.Role;
import put.eunice.cms.user.User;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDtoSimple {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private Role accountType;
    private String email;
    private boolean enabled;

    public static UserDtoSimple of(User user) {
        if (user == null) {
            return null;
        }
        return new UserDtoSimple(user);
    }

    private UserDtoSimple(User user) {
        id = user.getId();
        username = user.getUsername();
        firstName = user.getFirstName();
        lastName = user.getLastName();
        accountType = user.getAccountType();
        email = user.getEmail();
        enabled = user.isEnabled();
    }
}
