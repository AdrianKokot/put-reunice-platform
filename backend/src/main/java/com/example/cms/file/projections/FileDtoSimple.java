package com.example.cms.file.projections;

import com.example.cms.file.FileResource;
import com.example.cms.page.projections.PageDtoJoined;
import java.time.Instant;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FileDtoSimple {
    private String name;

    private String type;

    private Long size;
    private Instant lastModified;

    private String uploadedBy;
    private Long uploadedById;

    private Long id;
    private PageDtoJoined page;

    public static FileDtoSimple of(FileResource fileResource) {
        if (fileResource == null) {
            return null;
        }
        return new FileDtoSimple(fileResource);
    }

    public FileDtoSimple(FileResource fileResource) {
        this.name = fileResource.getFilename();
        this.type = fileResource.getFileType();
        this.lastModified = fileResource.getUploadDate().toInstant();
        this.uploadedBy = fileResource.getUploadedBy();
        this.size = fileResource.getFileSize();
        this.id = fileResource.getId();
        this.uploadedById = fileResource.getUploadedById();
        this.page = PageDtoJoined.of(fileResource.getPage());
    }
}
