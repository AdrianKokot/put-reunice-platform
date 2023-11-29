package com.example.cms;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SinglePageApplicationController {
    @GetMapping(value = "/**/{:[^\\.]*}")
    public String redirectToSinglePageApplication() {
        return "forward:/";
    }
}
