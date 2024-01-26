package put.eunice.cms.development;

import java.util.ArrayList;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.security.authentication.TestingAuthenticationToken;
import put.eunice.cms.security.LoggedUser;
import put.eunice.cms.security.Role;
import put.eunice.cms.university.University;
import put.eunice.cms.user.User;

public class CustomAuthenticationToken {

    private CustomAuthenticationToken() {}

    public static TestingAuthenticationToken create(Role accountType, Set<Long> universities) {
        return create(accountType, universities, 0L);
    }

    public static TestingAuthenticationToken create(
            Role accountType, Set<Long> universities, Long id) {
        User user = new User();
        user.setId(id);
        user.setUsername("Admin");
        user.setEmail("Admin@eunice.pl");
        user.setPassword("");
        user.setAccountType(accountType);
        user.setEnabled(true);
        user.setEnrolledUniversities(
                universities.stream()
                        .map(
                                universityId -> {
                                    var university = new University();
                                    university.setId(universityId);
                                    return university;
                                })
                        .collect(Collectors.toSet()));
        LoggedUser loggedUser = new LoggedUser(user);
        return new TestingAuthenticationToken(
                loggedUser, null, new ArrayList<>(loggedUser.getAuthorities()));
    }
}
