package put.eunice.cms.university.projections;

import lombok.Value;
import put.eunice.cms.university.University;

@Value
public class UniversityDtoFormUpdate {
    String name;
    String shortName;
    String description;
    String address;
    String website;
    Boolean hidden;

    public void updateUniversity(University university) {
        university.setName(name == null ? university.getName() : name);
        university.setShortName(shortName == null ? university.getShortName() : shortName);
        university.setDescription(description == null ? university.getDescription() : description);
        university.setAddress(address == null ? university.getAddress() : address);
        university.setWebsite(website == null ? university.getWebsite() : website);
        university.setHidden(hidden == null ? university.isHidden() : hidden);
    }
}
