package com.example.cms.page;

import com.example.cms.university.University;
import com.example.cms.user.User;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Objects;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.Hibernate;
import org.hibernate.validator.constraints.Length;

@Getter
@Setter
@Entity
@Table(name = "pages")
@AllArgsConstructor
@NoArgsConstructor
public class GlobalPage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "ERRORS.PAGE.400.TITLE_EMPTY")
    @Length(max = 255, message = "ERRORS.PAGE.400.TITLE_TOO_LONG")
    private String title;

    @Null private String description;

    @NotNull(message = "ERRORS.PAGE.400.CONTENT_EMPTY")
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Content content;

    @NotNull(message = "ERRORS.PAGE.400.HIDDEN_EMPTY")
    private boolean hidden;

    @ManyToOne(fetch = FetchType.EAGER)
    @Null
    private User creator;

    @ManyToOne(fetch = FetchType.EAGER)
    @Null
    private University university;

    @ManyToOne(fetch = FetchType.LAZY)
    @Null
    private Page parent;

    private Timestamp createdOn;
    private Timestamp updatedOn;

    public GlobalPage(String title, String content, boolean hidden) {
        this.title = title;
        this.content = Content.of(content);
        this.hidden = hidden;
    }

    @PrePersist
    private void prePersist() {
        var now = Timestamp.valueOf(LocalDateTime.now());
        createdOn = now;
        updatedOn = now;
    }

    @PreUpdate
    private void preMerge() {
        updatedOn = Timestamp.valueOf(LocalDateTime.now());
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        GlobalPage page = (GlobalPage) o;
        return id != null && Objects.equals(id, page.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
