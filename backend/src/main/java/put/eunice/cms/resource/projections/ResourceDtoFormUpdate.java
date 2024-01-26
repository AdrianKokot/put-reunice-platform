package put.eunice.cms.resource.projections;

import lombok.Value;
import org.springframework.web.multipart.MultipartFile;

@Value
public class ResourceDtoFormUpdate {
    String name;
    String description;
    Long authorId;
    MultipartFile file;
    String url;
}
