package com.example.cms.page.projections;

import lombok.Value;

import java.util.Set;

@Value
public class PageDtoFormUpdate {
    String title;
    String description;
    String content;
    Boolean hidden;
    Set<Long> contactRequestHandlers;
    Long creatorId;
}
