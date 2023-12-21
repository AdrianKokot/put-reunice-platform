package com.example.cms;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import com.example.cms.development.CustomAuthenticationToken;
import com.example.cms.security.Role;
import com.example.cms.user.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("secured, h2")
public class BaseAPIControllerTest {
    protected String getUrl(Long id) {
        return getUrl() + "/" + id;
    }

    /** @return API base url */
    protected String getUrl() {
        return "";
    }

    @Autowired protected UserRepository userRepository;
    @Autowired protected WebApplicationContext webApplicationContext;

    protected MockMvc mvc;
    protected SecurityContext ctx;

    @Autowired protected ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        SecurityContextHolder.setContext(SecurityContextHolder.createEmptyContext());
        ctx = SecurityContextHolder.getContext();

        mvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();

        this.setupData();
    }

    /** This method is used to set up data for the test */
    protected void setupData() {}

    /**
     * This method is used to get the value of a response body
     *
     * @param resultActions ResultActions object
     * @param valueTypeRef TypeReference object
     * @return T object
     */
    protected <T> T getValue(ResultActions resultActions, TypeReference<T> valueTypeRef)
            throws Exception {
        return objectMapper.readValue(
                resultActions.andReturn().getResponse().getContentAsString(), valueTypeRef);
    }

    /**
     * This method is used to get the value of a response body
     *
     * @param resultActions ResultActions object
     * @param valueTypeRef TypeReference object
     * @return T object
     */
    protected <T> T getValue(ResultActions resultActions, Class<T> valueTypeRef) throws Exception {
        return objectMapper.readValue(
                resultActions.andReturn().getResponse().getContentAsString(), valueTypeRef);
    }

    /** @return Perform APPLICATION_JSON GET request to the API url returned by getUrl() */
    protected ResultActions performGet() throws Exception {
        return mvc.perform(get(getUrl()).contentType(MediaType.APPLICATION_JSON));
    }

    /**
     * @param queryParams Query parameters to be appended to the API url returned by getUrl()
     * @return Perform APPLICATION_JSON GET request to the API url returned by getUrl() + queryParams
     */
    protected ResultActions performGet(String queryParams) throws Exception {
        return mvc.perform(get(getUrl() + queryParams).contentType(MediaType.APPLICATION_JSON));
    }

    /**
     * @param id ID of the object to be fetched
     * @return Perform APPLICATION_JSON GET request to the API url returned by getUrl(id)
     */
    protected ResultActions performGet(Long id) throws Exception {
        return mvc.perform(get(getUrl(id)).contentType(MediaType.APPLICATION_JSON));
    }

    /**
     * @param object Object to be created
     * @return Perform APPLICATION_JSON POST request to the API url returned by getUrl()
     */
    protected ResultActions performPost(Object object) throws Exception {
        return mvc.perform(
                post(getUrl())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(object)));
    }

    /**
     * @param id ID of the object to be updated
     * @param object Object to be updated
     * @return Perform APPLICATION_JSON PUT request to the API url returned by getUrl(id)
     */
    protected ResultActions performPut(Long id, Object object) throws Exception {
        return mvc.perform(
                put(getUrl(id))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(object)));
    }

    /**
     * @param id ID of the object to be deleted
     * @return Perform APPLICATION_JSON DELETE request to the API url returned by getUrl(id)
     */
    protected ResultActions performDelete(Long id) throws Exception {
        return mvc.perform(delete(getUrl(id)).contentType(MediaType.APPLICATION_JSON));
    }


    /**
     * Update an object using the PATCH method.
     *
     * @param id     ID of the object to be updated
     * @param object Object containing the fields to be updated
     * @return ResultActions after performing the PATCH request
     * @throws Exception if there is an error performing the request
     */
    protected ResultActions performPatch(Long id, String endpoint, Object object) throws Exception {
        return mvc.perform(
                patch(getUrl(id)+endpoint)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(object)));
    }
    /** Set the current user to anonymous (guest) */
    protected void performAsGuest() {
        ctx.setAuthentication(new TestingAuthenticationToken(null, null));
    }

    /**
     * Set the current user to the given role
     *
     * @param role Role of the user
     */
    protected void performAs(Role role) {
        performAs(role, Set.of());
    }

    /**
     * Set the current user to the given role and user
     *
     * @param role Role of the user
     * @param userId ID of the user. User will be updated to match the given role
     */
    protected void performAs(Role role, Long userId) {
        performAs(role, Set.of(), userId);
    }

    /**
     * Set the current user to the given role, user and universities
     *
     * @param role Role of the user
     * @param universities Universities of the user
     * @param userId ID of the user. User will be updated to match the given role
     */
    protected void performAs(Role role, Set<Long> universities, Long userId) {
        if (userRepository.existsById(userId)) {
            var user = userRepository.findById(userId).get();
            user.setAccountType(role);
            userRepository.save(user);
        }

        ctx.setAuthentication(CustomAuthenticationToken.create(role, universities, userId));
    }

    /**
     * Set the current user to the given role and universities
     *
     * @param role Role of the user
     * @param universities Universities of the user
     */
    protected void performAs(Role role, Set<Long> universities) {
        ctx.setAuthentication(CustomAuthenticationToken.create(role, universities));
    }
}
