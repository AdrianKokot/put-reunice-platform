package com.example.cms.security.authentication;

import com.example.cms.security.LoggedUser;
import com.example.cms.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
@RequiredArgsConstructor
public class RestAuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final UserService userService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) {
        clearAuthenticationAttributes(request);

        if (authentication.getPrincipal() instanceof LoggedUser) {
            LoggedUser user = (LoggedUser) authentication.getPrincipal();
            this.userService.updateLastLoginDate(user.getId());
        }
    }
}
