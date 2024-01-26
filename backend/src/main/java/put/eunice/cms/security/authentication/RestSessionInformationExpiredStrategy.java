package put.eunice.cms.security.authentication;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.web.session.SessionInformationExpiredEvent;
import org.springframework.security.web.session.SessionInformationExpiredStrategy;
import org.springframework.web.servlet.HandlerExceptionResolver;
import put.eunice.cms.validation.exceptions.SessionExpiredException;

public class RestSessionInformationExpiredStrategy implements SessionInformationExpiredStrategy {
    @Autowired
    @Qualifier("handlerExceptionResolver")
    private HandlerExceptionResolver resolver;

    @Override
    public void onExpiredSessionDetected(
            SessionInformationExpiredEvent sessionInformationExpiredEvent) {
        HttpServletRequest request = sessionInformationExpiredEvent.getRequest();
        HttpServletResponse response = sessionInformationExpiredEvent.getResponse();
        resolver.resolveException(request, response, null, new SessionExpiredException());
    }
}
