package put.eunice.cms.user;

import java.time.Instant;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.Hibernate;
import put.eunice.cms.page.Page;
import put.eunice.cms.security.Role;
import put.eunice.cms.ticketUserStatus.TicketUserStatus;
import put.eunice.cms.university.University;

@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @ManyToMany(
            cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.DETACH, CascadeType.REFRESH},
            fetch = FetchType.LAZY)
    @JoinTable(
            name = "users_enrolled",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "university_id"))
    private Set<University> enrolledUniversities = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.MERGE)
    private Set<TicketUserStatus> ticketsToHandle = new HashSet<>();

    @ManyToMany(mappedBy = "handlers", fetch = FetchType.EAGER)
    private Set<Page> handlersPages = new HashSet<>();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    @NotEmpty(message = "ERRORS.USER.400.USERNAME_EMPTY")
    private String username;

    @NotEmpty(message = "ERRORS.USER.400.PASSWORD_EMPTY")
    private String password;

    private String firstName;
    private String lastName;
    private Instant lastLoginDate;

    @Column(unique = true)
    @Email(message = "ERRORS.USER.400.EMAIL_NOT_VALID")
    private String email;

    @Pattern(message = "ERRORS.USER.400.PHONE_NUMBER_NOT_VALID", regexp = "^(\\+?\\d{3,12})?$")
    private String phoneNumber;

    private String description;

    @NotNull(message = "ERRORS.USER.400.ACCOUNT_TYPE_EMPTY")
    private Role accountType;

    private boolean enabled;

    @Override
    public String toString() {
        return "User{"
                + "id="
                + id
                + ", username='"
                + username
                + '\''
                + ", password='"
                + password
                + '\''
                + ", firstName='"
                + firstName
                + '\''
                + ", lastName='"
                + lastName
                + '\''
                + ", email='"
                + email
                + '\''
                + ", phoneNumber='"
                + phoneNumber
                + '\''
                + ", accountType='"
                + accountType
                + '\''
                + ", enabled="
                + enabled
                + '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        User user = (User) o;
        return id != null && Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    public User(String username, Role role, boolean enabled) {
        this.username = username;
        this.accountType = role;
        this.enabled = enabled;
        this.password = username;
        this.email = username + "@example.com";
    }
}
