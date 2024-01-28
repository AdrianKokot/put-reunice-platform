package put.eunice.cms;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.nio.file.Path;
import java.util.Set;
import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.multipart.MultipartFile;
import put.eunice.cms.development.CustomAuthenticationToken;
import put.eunice.cms.resource.FileResource;
import put.eunice.cms.resource.projections.ResourceDtoFormCreate;
import put.eunice.cms.resource.projections.ResourceDtoFormUpdate;
import put.eunice.cms.security.Role;
import put.eunice.cms.user.UserRepository;

@ExtendWith(SpringExtension.class)
@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = {
            "app.path.uploads=./test-directories/uploads/",
            "app.path.templates=./test-directories/templates/",
            "app.path.backups=./test-directories/backups/",
        })
@ActiveProfiles(profiles = {"h2", "secured", "test"})
@ContextConfiguration(classes = {CmsApplication.class})
public class BaseAPIControllerTest {
    protected String getUrl(Long id) {
        return getUrl() + "/" + id;
    }

    /**
     * @return API base url
     */
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

    /**
     * @return Perform APPLICATION_JSON GET request to the API url returned by getUrl()
     */
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

    protected ResultActions performPostFile(ResourceDtoFormCreate dto) throws Exception {
        if (dto.getFile() == null) {
            return mvc.perform(
                    MockMvcRequestBuilders.multipart(getUrl())
                            .param("name", dto.getName())
                            .param("authorId", String.valueOf(dto.getAuthorId()))
                            .param("description", dto.getDescription())
                            .param("url", dto.getUrl()));
        } else {
            return mvc.perform(
                    MockMvcRequestBuilders.multipart(getUrl())
                            .file(
                                    new MockMultipartFile(
                                            dto.getFile().getName(),
                                            dto.getFile().getOriginalFilename(),
                                            dto.getFile().getContentType(),
                                            dto.getFile().getInputStream()))
                            .param("name", dto.getName())
                            .param("authorId", String.valueOf(dto.getAuthorId()))
                            .param("description", dto.getDescription())
                            .param("url", dto.getUrl()));
        }
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

    protected ResultActions performPutFile(Long id, ResourceDtoFormUpdate dto) throws Exception {
        if (dto.getFile() == null) {
            return mvc.perform(
                    put(getUrl(id))
                            .contentType(MediaType.MULTIPART_FORM_DATA_VALUE)
                            .param("name", dto.getName())
                            .param("authorId", String.valueOf(dto.getAuthorId()))
                            .param("description", dto.getDescription())
                            .param("url", dto.getUrl()));
        } else {
            String parameterName = "param";
            MultipartFile file  = dto.getFile();
            return mvc.perform(
                    multipart(HttpMethod.PUT, getUrl(id))
                            .file((MockMultipartFile) file)
                            .contentType(MediaType.MULTIPART_FORM_DATA_VALUE)
                            .param("name", dto.getName())
                            .param("authorId", String.valueOf(dto.getAuthorId()))
                            .param("description", dto.getDescription())
                            .param("url", dto.getUrl()));
        }
    }

    /**
     * @param id ID of the object to be deleted
     * @return Perform APPLICATION_JSON DELETE request to the API url returned by getUrl(id)
     */
    protected ResultActions performDelete(Long id) throws Exception {
        return mvc.perform(delete(getUrl(id)).contentType(MediaType.APPLICATION_JSON));
    }

    /**
     * @param id ID of the object to be deleted
     * @param queryParams Query parameters to be appended to the API url returned by getUrl(id)
     * @return Perform APPLICATION_JSON DELETE request to the API url returned by getUrl(id)
     */
    protected ResultActions performDelete(Long id, String queryParams) throws Exception {
        return mvc.perform(delete(getUrl(id) + queryParams).contentType(MediaType.APPLICATION_JSON));
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

    @AfterAll
    public static void directoryCleanup() throws IOException {
        FileUtils.deleteDirectory(Path.of("./test-directories").toFile());
    }
}
