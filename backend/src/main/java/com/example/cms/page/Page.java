package com.example.cms.page;

import com.example.cms.university.University;
import com.example.cms.user.User;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.Hibernate;
import org.hibernate.annotations.Where;
import org.hibernate.validator.constraints.Length;

@Getter
@Setter
@Entity
@Table(name = "pages")
@AllArgsConstructor
@NoArgsConstructor
@Where(clause = "university_id IS NOT NULL")
public class Page extends AbstractPage {
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "page_handlers",
            joinColumns = @JoinColumn(name = "page_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<User> handlers = new HashSet<>();

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
