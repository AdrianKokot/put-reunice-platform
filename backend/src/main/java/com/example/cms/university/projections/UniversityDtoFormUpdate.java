package com.example.cms.university.projections;

import com.example.cms.university.University;
import lombok.Value;

@Value
public class UniversityDtoFormUpdate {
    String name;
    String shortName;
    String description;
    String address;
    String website;

    public void updateUniversity(University university) {
        university.setName(name);
        university.setShortName(shortName);
        university.setDescription(description);
        university.setAddress(address);
        university.setWebsite(website);
    }
}
