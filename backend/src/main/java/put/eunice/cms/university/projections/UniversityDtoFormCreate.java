package put.eunice.cms.university.projections;

import lombok.Value;
import put.eunice.cms.page.Content;
import put.eunice.cms.page.Page;
import put.eunice.cms.university.University;
import put.eunice.cms.user.User;

@Value
public class UniversityDtoFormCreate {
    String name;
    String shortName;
    String description;
    Long creatorId;

    String address;
    String website;

    public University toUniversity(User creator, String content) {
        University university = new University();
        university.setName(name);
        university.setShortName(shortName);
        university.setDescription(description);
        university.setHidden(true);
        university.setAddress(address);
        university.setWebsite(website);

        Page page = new Page();
        page.setTitle(university.getName());
        page.setDescription("Short description about university.");
        page.setContent(Content.of(content));
        page.setHidden(true);
        page.setUniversity(university);
        page.setCreator(creator);

        university.setMainPage(page);
        return university;
    }
}
