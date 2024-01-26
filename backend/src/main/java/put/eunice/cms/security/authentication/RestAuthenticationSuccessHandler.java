package put.eunice.cms.security.authentication;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import put.eunice.cms.security.LoggedUser;
import put.eunice.cms.user.UserService;

@Component
@RequiredArgsConstructor
public class RestAuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final UserService userService;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        clearAuthenticationAttributes(request);

        if (authentication.getPrincipal() instanceof LoggedUser) {
            LoggedUser user = (LoggedUser) authentication.getPrincipal();
            this.userService.updateLastLoginDate(user.getId());
        }
    }
}
