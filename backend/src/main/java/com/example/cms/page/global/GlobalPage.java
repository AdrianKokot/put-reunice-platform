package com.example.cms.page;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Table;

@Getter
@Setter
@Entity
@Table(name = "pages")
@AllArgsConstructor
@NoArgsConstructor
public class GlobalPage extends AbstractPage {

    private boolean isLanding;

    public GlobalPage(String title, String content, boolean hidden) {
        this.title = title;
        this.content = Content.of(content);
        this.hidden = hidden;
        this.isLanding = false;
    }
}
