package com.example.cms.file.projections;

import com.example.cms.file.FileResource;
import com.example.cms.file.ResourceType;
import com.example.cms.user.projections.UserDtoJoined;
import java.time.Instant;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ResourceDtoSimple {
    private String name;
    private Instant lastModified;
    private String type;
    private Long size;

    private UserDtoJoined author;
    private Long id;
    private ResourceType resourceType;
    private String path;

    public static ResourceDtoSimple of(FileResource fileResource) {
        if (fileResource == null) {
            return null;
        }
        return new ResourceDtoSimple(fileResource);
    }

    public ResourceDtoSimple(FileResource fileResource) {
        this.name = fileResource.getName();
        this.type = fileResource.getFileType();
        this.lastModified = fileResource.getUpdatedOn().toInstant();
        this.author = UserDtoJoined.of(fileResource.getAuthor());
        this.size = fileResource.getSize();
        this.id = fileResource.getId();
        this.resourceType = fileResource.getResourceType();
        this.path = fileResource.getPath();
    }
}
