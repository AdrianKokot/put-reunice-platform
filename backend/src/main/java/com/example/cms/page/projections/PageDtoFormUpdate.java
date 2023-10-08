package com.example.cms.page.projections;

import com.example.cms.page.Content;
import com.example.cms.page.Page;
import com.example.cms.page.PageService;
import com.example.cms.user.User;
import com.example.cms.user.UserRepository;
import com.example.cms.user.exceptions.UserNotFound;
import lombok.Value;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Value
public class PageDtoFormUpdate {
    String title;
    String description;
    String content;
    Boolean hidden;
    Set<Long> contactRequestHandlers;
}
