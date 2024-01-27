package put.eunice.cms.university;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.Hibernate;
import put.eunice.cms.page.Page;
import put.eunice.cms.template.Template;
import put.eunice.cms.user.User;

@Entity
@Table(name = "universities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
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
    @ToString.Exclude
    private Set<User> enrolledUsers = new HashSet<>();

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "main_page_id", referencedColumnName = "id")
    @ToString.Exclude
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

    @ManyToMany(mappedBy = "universities")
    @ToString.Exclude
    private Set<Template> templates = new HashSet<>();

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

    @PreRemove
    protected void removeTemplateAssociations() {
        for (var template : this.templates) {
            template.getUniversities().remove(this);
        }
    }

    public University(String name, String shortName, boolean hidden) {
        this.name = name;
        this.shortName = shortName;
        this.hidden = hidden;
        this.description = name;
    }
}
