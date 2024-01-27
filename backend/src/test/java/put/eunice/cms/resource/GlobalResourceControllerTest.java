package put.eunice.cms.resource;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Set;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import put.eunice.cms.BaseAPIControllerTest;
import put.eunice.cms.page.Content;
import put.eunice.cms.page.Page;
import put.eunice.cms.page.PageRepository;
import put.eunice.cms.security.Role;
import put.eunice.cms.university.University;
import put.eunice.cms.university.UniversityRepository;
import put.eunice.cms.user.User;

class GlobalResourceControllerTest extends BaseAPIControllerTest {
    @Autowired private UniversityRepository universityRepository;

    @Autowired private PageRepository pageRepository;
    @Autowired private FileResourceRepository fileResourceRepository;

    private Long universityId = 99L;
    private Long pageId = 99L;
    private Long userId = 99L;
    private Long resourceId = 99L;

    @Override
    protected String getUrl() {
        return "/api/resources/page";
    }

    @Override
    public void setupData() {
        var user = new User("TEST_USER", Role.USER, true);
        user = userRepository.save(user);
        this.userId = user.getId();

        var university = new University("TEST_UNIVERSITY", "TST_U", false);
        university = universityRepository.save(university);
        this.universityId = university.getId();

        university.setEnrolledUsers(Set.of(user));
        university = universityRepository.save(university);

        var page =
                new Page(
                        "TEST_MAIN_PAGE",
                        "TEST_MAIN_PAGE",
                        new Content(null, "TEST_CONTENT"),
                        false,
                        user,
                        university,
                        null);
        page = pageRepository.save(page);
        this.pageId = page.getId();

        FileResource fileResource = new FileResource();
        fileResource.setId(1L);
        fileResource.setName("Test File");
        fileResource.setDescription("This is a test file");
        fileResource.setPath("/path/to/test/file.txt");
        fileResource.setFileType("text/plain");
        fileResource.setSize(1024L);
        fileResource.setResourceType(ResourceType.FILE);
        fileResource.setCreatedOn(Timestamp.from(Instant.now()));
        fileResource.setUpdatedOn(Timestamp.from(Instant.now()));
        fileResource.setAuthor(user);
        fileResource.setPages(Set.of(page));
        fileResource = fileResourceRepository.save(fileResource);
        this.resourceId = fileResource.getId();
    }

    @AfterEach
    public void cleanup() {
        if (fileResourceRepository.existsById(this.resourceId))
            fileResourceRepository.deleteById(this.resourceId);

        if (pageRepository.existsById(this.pageId)) pageRepository.deleteById(this.pageId);

        if (universityRepository.existsById(this.universityId))
            universityRepository.deleteById(this.universityId);

        if (userRepository.existsById(this.userId)) userRepository.deleteById(this.userId);
    }

    @Nested
    class GetResourceTestClass {
        @Nested
        class ResourceTestClass {
            @Test
            void get_Resource_GuestUser_resource() throws Exception {
                performAsGuest();
                performGet(pageId).andExpect(status().isOk());
            }

            @Test
            void get_Resource_User_resource() throws Exception {
                performAs(Role.USER, userId);
                performGet(pageId).andExpect(status().isOk());
            }

            @Test
            void get_Resource_Moderator_resource() throws Exception {
                performAs(Role.MODERATOR, userId);
                performGet(pageId).andExpect(status().isOk());
            }

            @Test
            void get_Resource_Admin_resource() throws Exception {
                performAs(Role.ADMIN, userId);
                performGet(pageId).andExpect(status().isOk());
            }
        }
    }
}
