package com.example.cms.page;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Objects;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;
import org.hibernate.validator.constraints.Length;

@Getter(AccessLevel.PUBLIC)
@Setter(AccessLevel.PUBLIC)
@MappedSuperclass
public abstract class AbstractPage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @NotBlank(message = "ERRORS.PAGE.400.TITLE_EMPTY")
    @Length(max = 255, message = "ERRORS.PAGE.400.TITLE_TOO_LONG")
    protected String title;

    @NotNull(message = "ERRORS.PAGE.400.CONTENT_EMPTY")
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    protected Content content;

    protected boolean hidden;

    protected Timestamp createdOn;
    protected Timestamp updatedOn;

    @PrePersist
    protected void prePersist() {
        var now = Timestamp.valueOf(LocalDateTime.now());
        createdOn = now;
        updatedOn = now;
    }

    @PreUpdate
    protected void preMerge() {
        updatedOn = Timestamp.valueOf(LocalDateTime.now());
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        AbstractPage page = (AbstractPage) o;
        return id != null && Objects.equals(id, page.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
