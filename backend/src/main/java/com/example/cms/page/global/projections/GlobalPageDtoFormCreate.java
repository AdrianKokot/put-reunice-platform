package com.example.cms.page.global.projections;

import lombok.Value;

@Value
public class GlobalPageDtoFormCreate {
    String title;
    String content;
    Boolean hidden;
}
