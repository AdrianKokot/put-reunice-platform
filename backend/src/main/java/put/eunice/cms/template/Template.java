package put.eunice.cms.template;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.Hibernate;
import org.hibernate.validator.constraints.Length;
import put.eunice.cms.university.University;

@Entity
@Table(name = "templates")
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Template {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "ERRORS.TEMPLATE.400.NAME_EMPTY")
    @Length(max = 255, message = "ERRORS.TEMPLATE.400.NAME_TOO_LONG")
    private String name;

    @Column(columnDefinition = "TEXT")
    @NotNull(message = "ERRORS.TEMPLATE.400.CONTENT_EMPTY")
    @ToString.Exclude
    private String content;

    @ManyToMany(
            fetch = FetchType.LAZY,
            cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinTable(
            name = "templates_universities",
            joinColumns = @JoinColumn(name = "template_id"),
            inverseJoinColumns = @JoinColumn(name = "university_id"))
    private Set<University> universities = new HashSet<>();

    private boolean availableToAll = false;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Template template = (Template) o;
        return id != null && Objects.equals(id, template.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    public Template(String name, String content) {
        this(name, content, false);
    }

    public Template(String name, String content, boolean availableToAll) {
        this.name = name;
        this.content = content;
        this.availableToAll = availableToAll;
    }

    public void attachUniversity(University university) {
        this.universities.add(university);
    }
}
