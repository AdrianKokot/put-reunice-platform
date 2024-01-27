package put.eunice.cms.resource.projections;

import java.time.Instant;
import lombok.Data;
import lombok.NoArgsConstructor;
import put.eunice.cms.resource.FileResource;
import put.eunice.cms.resource.ResourceType;
import put.eunice.cms.user.projections.UserDtoJoined;

@Data
@NoArgsConstructor
public class ResourceDtoSimple {
    private String name;
    private Instant updatedOn;
    private String type;
    private Long size;

    private UserDtoJoined author;
    private Long id;
    private ResourceType resourceType;
    private String path;
    private String description;

    public static ResourceDtoSimple of(FileResource fileResource) {
        if (fileResource == null) {
            return null;
        }
        return new ResourceDtoSimple(fileResource);
    }

    public ResourceDtoSimple(FileResource fileResource) {
        this.name = fileResource.getName();
        this.type = fileResource.getFileType();
        this.updatedOn = fileResource.getUpdatedOn().toInstant();
        this.author = UserDtoJoined.of(fileResource.getAuthor());
        this.size = fileResource.getSize();
        this.id = fileResource.getId();
        this.resourceType = fileResource.getResourceType();
        this.path = fileResource.getBrowserSafeUrl();
        this.description = fileResource.getDescription();
    }
}
