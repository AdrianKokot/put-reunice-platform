package put.eunice.cms.resource.projections;

import lombok.Value;
import org.springframework.web.multipart.MultipartFile;

@Value
public class ResourceDtoFormCreate {
    String name;
    String description;
    Long authorId;
    MultipartFile file;
    String url;
}
