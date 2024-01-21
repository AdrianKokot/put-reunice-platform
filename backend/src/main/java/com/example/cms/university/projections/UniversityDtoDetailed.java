package com.example.cms.university.projections;

import com.example.cms.page.projections.PageDtoDetailed;
import com.example.cms.university.University;
import com.example.cms.user.projections.UserDtoSimple;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UniversityDtoDetailed {
    private Long id;
    private String name;
    private String shortName;
    private String description;
    private boolean hidden;
    private PageDtoDetailed mainPage;
    private Set<UserDtoSimple> enrolledUsers;
    private String address;
    private String website;
    private String image;

    public static UniversityDtoDetailed of(University university) {
        if (university == null) {
            return null;
        }
        return new UniversityDtoDetailed(university);
    }

    private UniversityDtoDetailed(University university) {
        id = university.getId();
        name = university.getName();
        shortName = university.getShortName();
        description = university.getDescription();
        hidden = university.isHidden();
        enrolledUsers =
                university.getEnrolledUsers().stream().map(UserDtoSimple::of).collect(Collectors.toSet());
        mainPage = PageDtoDetailed.of(university.getMainPage(), false);
        address = university.getAddress();
        website = university.getWebsite();
        image = university.getImage();
    }
}
