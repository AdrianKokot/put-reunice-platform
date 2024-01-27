package put.eunice.cms.resource.projections;

import java.time.Instant;
import lombok.Data;
import lombok.NoArgsConstructor;
import put.eunice.cms.resource.FileResource;
import put.eunice.cms.resource.ResourceType;
import put.eunice.cms.user.projections.UserDtoSimple;

@Data
@NoArgsConstructor
public class ResourceDtoDetailed {
    private String name;
    private Instant updatedOn;
    private String type;
    private Long size;

    private UserDtoSimple author;
    private Long id;
    private ResourceType resourceType;
    private String path;
    private String description;
    private Instant createdOn;
    private boolean referenced;

    public static ResourceDtoDetailed of(FileResource fileResource) {
        if (fileResource == null) {
            return null;
        }
        return new ResourceDtoDetailed(fileResource);
    }

    public ResourceDtoDetailed(FileResource fileResource) {
        this.name = fileResource.getName();
        this.type = fileResource.getFileType();
        this.updatedOn = fileResource.getUpdatedOn().toInstant();
        this.author = UserDtoSimple.of(fileResource.getAuthor());
        this.size = fileResource.getSize();
        this.id = fileResource.getId();
        this.resourceType = fileResource.getResourceType();
        this.path = fileResource.getBrowserSafeUrl();
        this.description = fileResource.getDescription();
        this.createdOn = fileResource.getCreatedOn().toInstant();
        this.referenced = !fileResource.getPages().isEmpty();
    }
}
