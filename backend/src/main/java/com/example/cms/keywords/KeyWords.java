package com.example.cms.keywords;

import java.util.Objects;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.Hibernate;

@Entity
@Table(name = "keyWords")
@Getter
@Setter
@ToString
public class KeyWords {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "ERRORS.KEYWORDS.400.WORD_EMPTY")
    private String word;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        KeyWords keyWords = (KeyWords) o;
        return id != null && Objects.equals(id, keyWords.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
