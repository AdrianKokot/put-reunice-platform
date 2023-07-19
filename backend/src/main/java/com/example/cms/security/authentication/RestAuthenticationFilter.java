package com.example.cms.security.authentication;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.session.CompositeSessionAuthenticationStrategy;
import org.springframework.stereotype.Component;

import com.example.cms.configuration.ApplicationConfigurationProvider;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class RestAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

	@Autowired
	private ApplicationConfigurationProvider applicationConfigurationProvider;

    public RestAuthenticationFilter(AuthenticationManager authenticationManager,
                                    AuthenticationSuccessHandler authenticationSuccessHandler,
                                    AuthenticationFailureHandler authenticationFailureHandler,
                                    CompositeSessionAuthenticationStrategy sessionAuthenticationStrategy) {
        setAuthenticationManager(authenticationManager);
        setAuthenticationSuccessHandler(authenticationSuccessHandler);
        setAuthenticationFailureHandler(authenticationFailureHandler);
        setSessionAuthenticationStrategy(sessionAuthenticationStrategy);
    }

    @Override
    public Authentication attemptAuthentication(
            HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {

    	//BEGIN MSz
//		String origin = request.getHeader("Origin");
//		System.out.println(">>>>>>>>>>>>>>>>>");
//		System.out.println(">>>>>>>>>>>>>>>>> Origin: " + origin); //DEL
//		System.out.println(">>>>>>>>>>>>>>>>> Host: " + request.getHeader("Host")); //DEL
//		System.out.println(">>>>>>>>>>>>>>>>> X-Forwarded-For: " + request.getHeader("X-Forwarded-For")); //DEL
//		System.out.println(">>>>>>>>>>>>>>>>> URL: " + request.getRequestURL()); //DEL
//		System.out.println(">>>>>>>>>>>>>>>>>");
//		System.out.println();
//		List<String> acceptedOrigins = List.of("http://ms.cs.put.poznan.pl", "http://localhost"); // MSz allowed origins
//		if (origin != null && acceptedOrigins.contains(origin)) {
//			response.setHeader("Access-Control-Allow-Origin", origin);
//		}
    	//response.setHeader("Access-Control-Allow-Origin", "http://localhost:4200"); //MSz commented
    	// System.out.println("** Application server address read from properties file: "+applicationConfigurationProvider.getApplicationServer()); //MSz added
      //   response.setHeader("Access-Control-Allow-Origin", applicationConfigurationProvider.getApplicationServer()); //MSz added
        //END MSz
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");


        LoginForm form;
        try {
            form = new ObjectMapper().readValue(request.getInputStream(), LoginForm.class);
        } catch (IOException e) {
            throw new AuthenticationServiceException(e.getMessage(), e);
        }

        UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(
                form.getUsername(), form.getPassword());

        return this.getAuthenticationManager().authenticate(authRequest);
    }

}
