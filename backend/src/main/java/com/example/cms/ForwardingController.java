package com.example.cms;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Controller
public class ForwardingController {
    @RequestMapping("/{path:[^\\.]*}")
    public void redirect(HttpServletResponse response) throws IOException {
        response.sendRedirect("/");
    }
}
