package put.eunice.cms.user.projections;

import lombok.Data;
import put.eunice.cms.user.User;

@Data
public class UserDtoJoined {
    private Long id;
    private String firstName;
    private String lastName;

    public static UserDtoJoined of(User user) {
        if (user == null) {
            return null;
        }
        return new UserDtoJoined(user);
    }

    private UserDtoJoined(User user) {
        id = user.getId();
        firstName = user.getFirstName();
        lastName = user.getLastName();
    }
}
