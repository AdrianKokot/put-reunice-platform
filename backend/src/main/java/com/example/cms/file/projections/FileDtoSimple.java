package com.example.cms.file.projections;

import com.example.cms.file.FileResource;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.Instant;

@Data
@NoArgsConstructor
public class FileDtoSimple {
    private String name;

    private String type;

    private Long size;
    private Instant lastModified;

    private String uploadedBy;

    private Long id;


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
    }

    public FileDtoSimple(String filename, String fileType, Long fileSize, String uploadedDate, String uploadedBy) {
        this.name = filename;
        this.type = fileType;
        this.lastModified = Timestamp.valueOf(uploadedDate).toInstant();
        this.uploadedBy = uploadedBy;
        this.size = fileSize;
        this.id = -1L;
    }
}
