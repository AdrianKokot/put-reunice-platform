package put.eunice.cms.page;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.Hibernate;
import org.hibernate.annotations.Where;
import org.hibernate.validator.constraints.Length;
import put.eunice.cms.resource.FileResource;
import put.eunice.cms.university.University;
import put.eunice.cms.user.User;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "pages")
@Where(clause = "university_id IS NOT NULL")
public class Page extends AbstractPage {
    @NotBlank(message = "ERRORS.PAGE.400.DESCRIPTION_EMPTY")
    @Length(max = 255, message = "ERRORS.PAGE.400.DESCRIPTION_TOO_LONG")
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    private User creator;

    @ManyToOne(fetch = FetchType.EAGER)
    private University university;

    @ManyToOne(fetch = FetchType.LAZY)
    private Page parent;

    @OneToMany(mappedBy = "parent", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Page> children = new HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "page_handlers",
            joinColumns = @JoinColumn(name = "page_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<User> handlers = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "page_resources",
            joinColumns = @JoinColumn(name = "page_id"),
            inverseJoinColumns = @JoinColumn(name = "resource_id"))
    private Set<FileResource> resources = new HashSet<>();

    public Page(
            String title,
            String description,
            Content content,
            boolean hidden,
            User creator,
            University university,
            Page parent) {
        this.title = title;
        this.content = content;
        this.description = description;
        this.creator = creator;
        this.university = university;
        this.parent = parent;
        this.hidden = hidden;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Page page = (Page) o;
        return id != null && Objects.equals(id, page.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
