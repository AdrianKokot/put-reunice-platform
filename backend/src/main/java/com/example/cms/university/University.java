package com.example.cms.university;

import com.example.cms.page.Page;
import com.example.cms.user.User;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.Hibernate;

@Entity
@Table(name = "universities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class University {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany(
            cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.DETACH, CascadeType.REFRESH},
            fetch = FetchType.LAZY)
    @JoinTable(
            name = "users_enrolled",
            joinColumns = @JoinColumn(name = "university_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<User> enrolledUsers = new HashSet<>();

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "main_page_id", referencedColumnName = "id")
    private Page mainPage;

    @Column(unique = true)
    @NotBlank(message = "ERRORS.UNIVERSITY.400.NAME_EMPTY")
    private String name;

    @Column(unique = true)
    @NotBlank(message = "ERRORS.UNIVERSITY.400.SHORT_NAME_EMPTY")
    private String shortName;

    private String address;
    private String website;

    @NotBlank(message = "ERRORS.UNIVERSITY.400.DESCRIPTION_EMPTY")
    private String description;

    private boolean hidden;

    private String image;

    @Override
    public String toString() {
        return "University{"
                + "id="
                + id
                + ", name='"
                + name
                + '\''
                + ", shortName='"
                + shortName
                + '\''
                + ", isHidden="
                + hidden
                + '}';
    }

    public void enrollUsers(User user) {
        enrolledUsers.add(user);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        University that = (University) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
