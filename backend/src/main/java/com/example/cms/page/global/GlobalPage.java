package com.example.cms.page.global;

import com.example.cms.page.AbstractPage;
import com.example.cms.page.Content;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;

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
}
