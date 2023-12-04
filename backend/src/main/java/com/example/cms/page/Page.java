package com.example.cms.page;

import com.example.cms.university.University;
import com.example.cms.user.User;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.Hibernate;

@Getter
@Setter
@Entity
@Table(name = "pages")
@AllArgsConstructor
@NoArgsConstructor
public class Page {
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "page_handlers",
            joinColumns = @JoinColumn(name = "page_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<User> handlers = new HashSet<>();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "ERRORS.PAGE.400.TITLE_EMPTY")
    private String title;

    @NotBlank(message = "ERRORS.PAGE.400.DESCRIPTION_EMPTY")
    private String description;

    @NotNull(message = "ERRORS.PAGE.400.CONTENT_EMPTY")
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Content content;

    private boolean hidden;

    @ManyToOne(fetch = FetchType.EAGER)
    @NotNull(message = "ERRORS.PAGE.400.CREATOR_EMPTY")
    private User creator;

    @ManyToOne(fetch = FetchType.EAGER)
    @NotNull(message = "ERRORS.PAGE.400.UNIVERSITY_EMPTY")
    private University university;

    @ManyToOne(fetch = FetchType.LAZY)
    private Page parent;

    @OneToMany(mappedBy = "parent", fetch = FetchType.LAZY)
    private Set<Page> children = new HashSet<>();

    private Timestamp createdOn;
    private Timestamp updatedOn;
    private String keyWords;

    @PrePersist
    private void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        createdOn = Timestamp.valueOf(now);
        updatedOn = Timestamp.valueOf(now);
    }

    @PreUpdate
    private void preMerge() {
        updatedOn = Timestamp.valueOf(LocalDateTime.now());
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
