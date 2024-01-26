package put.eunice.cms.university.projections;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import put.eunice.cms.university.University;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UniversityDtoSimple implements Serializable {
    private Long id;
    private String name;
    private String shortName;
    private boolean hidden;
    private String address;
    private String image;
    private String description;

    public static UniversityDtoSimple of(University university) {
        if (university == null) {
            return null;
        }
        return new UniversityDtoSimple(university);
    }

    private UniversityDtoSimple(University university) {
        id = university.getId();
        name = university.getName();
        shortName = university.getShortName();
        hidden = university.isHidden();
        address = university.getAddress();
        image = university.getImage();
        description = university.getDescription();
    }
}
