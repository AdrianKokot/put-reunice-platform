package put.eunice.cms;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SinglePageApplicationController {
    @GetMapping(value = "/**/{path:[^\\.]*}")
    public String redirectToSinglePageApplication() {
        return "forward:/";
    }
}
