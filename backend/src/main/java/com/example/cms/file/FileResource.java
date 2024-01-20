package com.example.cms.file;

import com.example.cms.page.Page;
import com.example.cms.user.User;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.validator.constraints.Length;

@Entity
@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "resources")
public class FileResource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Length(max = 255, message = "ERRORS.RESOURCE.400.NAME_TOO_LONG")
    @NotBlank(message = "ERRORS.RESOURCE.400.NAME_EMPTY")
    private String name;

    @Length(max = 255, message = "ERRORS.RESOURCE.400.DESCRIPTION_TOO_LONG")
    @NotBlank(message = "ERRORS.RESOURCE.400.DESCRIPTION_EMPTY")
    private String description;

    private String path;

    private String fileType;

    @NotNull(message = "ERRORS.RESOURCE.400.SIZE_EMPTY")
    private Long size = 0L;

    private ResourceType resourceType = ResourceType.FILE;

    private Timestamp createdOn;
    private Timestamp updatedOn;

    @ManyToOne(fetch = FetchType.EAGER)
    private User author;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "page_resources",
            joinColumns = @JoinColumn(name = "resource_id"),
            inverseJoinColumns = @JoinColumn(name = "page_id"))
    private Set<Page> pages = new HashSet<>();

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

    public FileResource(String name, String description, User author) {
        this.name = name;
        this.description = description;
        this.author = author;
    }

    public void setAsFileResource(String path, String fileType, Long size) {
        this.path = path;
        this.fileType = fileType;
        this.size = size;
        this.resourceType =
                fileType.split("/")[0].equals("image") ? ResourceType.IMAGE : ResourceType.FILE;
    }

    public void setAsLinkResource(String url) {
        this.path = url;
        this.resourceType = ResourceType.LINK;
    }
}
