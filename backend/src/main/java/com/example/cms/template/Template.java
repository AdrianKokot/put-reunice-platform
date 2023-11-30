package com.example.cms.template;

import com.example.cms.university.University;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.Hibernate;

@Entity
@Table(name = "templates")
@Getter
@Setter
@ToString
public class Template {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "ERRORS.TEMPLATE.400.NAME_EMPTY")
    private String name;

    @Lob
    @NotNull(message = "ERRORS.TEMPLATE.400.CONTENT_EMPTY")
    private String content;

    @ManyToMany(
            cascade = {
                CascadeType.MERGE,
                CascadeType.PERSIST,
                CascadeType.DETACH,
                CascadeType.REFRESH
            },
            fetch = FetchType.LAZY)
    @JoinTable(
            name = "templates_universities",
            joinColumns = @JoinColumn(name = "template_id"),
            inverseJoinColumns = @JoinColumn(name = "university_id"))
    @ToString.Exclude
    private Set<University> universities = new HashSet<>();

    @NotNull(message = "isAvailableForAll must not be null")
    private Boolean isAvailableToAll = false;

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
}
