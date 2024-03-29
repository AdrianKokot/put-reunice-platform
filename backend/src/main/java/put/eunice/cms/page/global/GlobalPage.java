package put.eunice.cms.page.global;

import java.util.Objects;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import lombok.*;
import org.hibernate.Hibernate;
import org.hibernate.annotations.Where;
import put.eunice.cms.page.AbstractPage;
import put.eunice.cms.page.Content;

@Getter
@Setter
@Entity
@Table(name = "pages")
@AllArgsConstructor
@NoArgsConstructor
@Where(clause = "university_id IS NULL")
public class GlobalPage extends AbstractPage {

    @Column(columnDefinition = "boolean default false")
    private boolean isLanding = false;

    public GlobalPage(String title, String content, boolean hidden) {
        this.title = title;
        this.content = Content.of(content);
        this.hidden = hidden;
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
