package com.example.cms.page;

import com.example.cms.util.HTMLSanitiser;
import java.util.Objects;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.Hibernate;

@Getter
@Setter
@Entity
@Table(name = "contents")
@NoArgsConstructor
@AllArgsConstructor
public class Content {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @NotNull(message = "Page content must not be null")
    private String pageContent;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Content content = (Content) o;
        return id != null && Objects.equals(id, content.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    public static Content of(String pageContent) {
        Content content = new Content();
        content.setPageContent(HTMLSanitiser.encodeInvalidMarkup(pageContent));
        return content;
    }
}
