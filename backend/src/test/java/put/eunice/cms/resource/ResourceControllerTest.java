package put.eunice.cms.resource;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.util.Assert;
import put.eunice.cms.BaseAPIControllerTest;
import put.eunice.cms.page.Content;
import put.eunice.cms.page.Page;
import put.eunice.cms.page.PageRepository;
import put.eunice.cms.resource.projections.ResourceDtoFormCreate;
import put.eunice.cms.resource.projections.ResourceDtoFormUpdate;
import put.eunice.cms.security.Role;
import put.eunice.cms.university.University;
import put.eunice.cms.university.UniversityRepository;
import put.eunice.cms.user.User;

class ResourceControllerTest extends BaseAPIControllerTest {
    @Autowired private UniversityRepository universityRepository;

    @Autowired private PageRepository pageRepository;
    @Autowired private FileResourceRepository fileResourceRepository;

    private Long universityId = 99L;
    private Long pageId = 99L;
    private Long userId = 99L;
    private Long anotherUserId = 99L;
    private Long resourceId = 99L;

    @Override
    protected String getUrl() {
        return "/api/resources";
    }

    private MockMultipartFile createMockMultipartFile() throws IOException {
        String fileName = "file.txt";
        String content = "This is a test file content";
        return new MockMultipartFile(
                "file", fileName, "application/octet-stream", content.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public void setupData() {
        var user = new User("TEST_USER", Role.USER, true);
        user = userRepository.save(user);
        this.userId = user.getId();

        var anotherUser = new User("ANOTHER_TEST_USER", Role.USER, true);
        anotherUser = userRepository.save(anotherUser);
        this.anotherUserId = anotherUser.getId();

        var university = new University("TEST_UNIVERSITY", "TST_U", false);
        university = universityRepository.save(university);
        this.universityId = university.getId();

        university.setEnrolledUsers(Set.of(user, anotherUser));
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

        var fileResource =
                new FileResource(
                        1L,
                        "Test File",
                        "Test description",
                        "test path",
                        "test filetype",
                        1L,
                        ResourceType.FILE,
                        Timestamp.from(Instant.now()),
                        Timestamp.from(Instant.now()),
                        user,
                        Set.of(page));
        fileResource = fileResourceRepository.save(fileResource);
        this.resourceId = fileResource.getId();
    }

    @AfterEach
    public void cleanup() {
        fileResourceRepository.deleteAll();

        if (pageRepository.existsById(this.pageId)) pageRepository.deleteById(this.pageId);

        if (userRepository.existsById(this.userId)) userRepository.deleteById(this.userId);
        if (userRepository.existsById(this.anotherUserId))
            userRepository.deleteById(this.anotherUserId);

        if (universityRepository.existsById(this.universityId))
            universityRepository.deleteById(this.universityId);
    }

    @Nested
    class ResourceTestClass {
        @Nested
        class GetResourceTestClass {
            @Test
            void get_Resource_GuestUser_unauthorized() throws Exception {
                performAsGuest();
                performGet(resourceId).andExpect(status().isUnauthorized());
            }

            @Test
            void get_Resource_User_resource() throws Exception {
                performAs(Role.USER, userId);
                performGet(resourceId).andExpect(status().isOk());
            }

            @Test
            void get_Resource_Moderator_resource() throws Exception {
                performAs(Role.MODERATOR, userId);
                performGet(resourceId).andExpect(status().isOk());
            }

            @Test
            void get_Resource_Admin_resource() throws Exception {
                performAs(Role.ADMIN, userId);
                performGet(resourceId).andExpect(status().isOk());
            }
        }

        @Nested
        class CreateResourceTestClass {

            @Test
            void create_Resource_GuestUser_unauthorized() throws Exception {
                ResourceDtoFormCreate dto =
                        new ResourceDtoFormCreate("name", "desc", userId, createMockMultipartFile(), null);
                performAsGuest();
                performPostFile(dto).andExpect(status().isUnauthorized());
            }

            @Test
            void create_Resource_User_Success() throws Exception {
                performAs(Role.USER, userId);
                ResourceDtoFormCreate dto =
                        new ResourceDtoFormCreate("name", "desc", userId, createMockMultipartFile(), null);
                performPostFile(dto).andExpect(status().isOk());
            }

            @Test
            void create_Resource_Moderator_Success() throws Exception {
                performAs(Role.MODERATOR, userId);
                ResourceDtoFormCreate dto =
                        new ResourceDtoFormCreate("name", "desc", userId, createMockMultipartFile(), null);
                performPostFile(dto).andExpect(status().isOk());
            }

            @Test
            void create_Resource_Admin_Success() throws Exception {
                performAs(Role.ADMIN, userId);
                ResourceDtoFormCreate dto =
                        new ResourceDtoFormCreate("name", "desc", userId, createMockMultipartFile(), null);
                performPostFile(dto).andExpect(status().isOk());
            }

            @Test
            void create_Link_GuestUser_unauthorized() throws Exception {
                ResourceDtoFormCreate dto = new ResourceDtoFormCreate("name", "desc", userId, null, "URL");
                performAsGuest();
                performPostFile(dto).andExpect(status().isUnauthorized());
            }

            @Test
            void create_Link_User_Success() throws Exception {
                performAs(Role.USER, userId);
                ResourceDtoFormCreate dto = new ResourceDtoFormCreate("name", "desc", userId, null, "URL");
                performPostFile(dto).andExpect(status().isOk());
            }

            @Test
            void create_Link_Moderator_Success() throws Exception {
                performAs(Role.MODERATOR, userId);
                ResourceDtoFormCreate dto = new ResourceDtoFormCreate("name", "desc", userId, null, "URL");
                performPostFile(dto).andExpect(status().isOk());
            }

            @Test
            void create_Link_Admin_Success() throws Exception {
                performAs(Role.ADMIN, userId);
                ResourceDtoFormCreate dto = new ResourceDtoFormCreate("name", "desc", userId, null, "URL");
                performPostFile(dto).andExpect(status().isOk());
            }
        }

        @Nested
        class UpdateResourceTestClass {
            @Test
            void update_Resource_GuestUser_Unauthorized() throws Exception {
                ResourceDtoFormUpdate dto =
                        new ResourceDtoFormUpdate("name", "desc", userId, createMockMultipartFile(), null);
                performAsGuest();
                performPutFile(resourceId, dto).andExpect(status().isUnauthorized());
            }

            @Test
            void update_Resource_UserOfOtherUniversity_Forbidden() throws Exception {
                ResourceDtoFormUpdate dto =
                        new ResourceDtoFormUpdate("name", "desc", userId, createMockMultipartFile(), null);
                performAs(Role.USER, Set.of(-1L), 1L);
                performPutFile(resourceId, dto).andExpect(status().isForbidden());
            }

            @Test
            void update_Resource_UniversityAdministratorOfOtherUniversity_Forbidden() throws Exception {
                ResourceDtoFormUpdate dto =
                        new ResourceDtoFormUpdate("name", "desc", userId, createMockMultipartFile(), null);
                performAs(Role.MODERATOR, Set.of(-1L), 1L);
                performPutFile(resourceId, dto).andExpect(status().isForbidden());
            }

            @Test
            void update_Resource_AdministratorNotAuthor_Success() throws Exception {
                ResourceDtoFormUpdate dto =
                        new ResourceDtoFormUpdate("name", "desc", userId, createMockMultipartFile(), null);
                performAs(Role.ADMIN);
                performPutFile(resourceId, dto).andExpect(status().is2xxSuccessful());
            }

            @Test
            void update_Resource_UserOfTheSameUniversityButNotAuthor_Success() throws Exception {
                ResourceDtoFormUpdate dto =
                        new ResourceDtoFormUpdate(
                                "name", "desc", anotherUserId, createMockMultipartFile(), null);
                performAs(Role.USER, Set.of(universityId), anotherUserId);
                performPutFile(resourceId, dto).andExpect(status().is2xxSuccessful());
            }

            @Test
            void update_Resource_UniversityAdministratorOfTheSameUniversityButNotAuthor_Success()
                    throws Exception {
                ResourceDtoFormUpdate dto =
                        new ResourceDtoFormUpdate("name", "desc", userId, createMockMultipartFile(), null);
                performAs(Role.MODERATOR, Set.of(universityId), anotherUserId);
                performPutFile(resourceId, dto).andExpect(status().is2xxSuccessful());
            }

            @Test
            void update_Resource_User_Success() throws Exception {
                ResourceDtoFormUpdate dto =
                        new ResourceDtoFormUpdate("name", "desc", userId, createMockMultipartFile(), null);
                performAs(Role.USER, userId);
                performPutFile(resourceId, dto).andExpect(status().is2xxSuccessful());
            }

            @Test
            void update_Resource_Moderator_Success() throws Exception {
                ResourceDtoFormUpdate dto =
                        new ResourceDtoFormUpdate("name", "desc", userId, createMockMultipartFile(), null);
                performAs(Role.MODERATOR, userId);
                performPutFile(resourceId, dto).andExpect(status().is2xxSuccessful());
            }

            @Test
            void update_Resource_Admin_Success() throws Exception {
                ResourceDtoFormUpdate dto =
                        new ResourceDtoFormUpdate("name", "desc", userId, createMockMultipartFile(), null);
                performAs(Role.ADMIN, userId);
                performPutFile(resourceId, dto).andExpect(status().is2xxSuccessful());
            }

            @Test
            void update_Link_GuestUser_Unauthorized() throws Exception {
                ResourceDtoFormUpdate dto = new ResourceDtoFormUpdate("name", "desc", userId, null, "URL");
                performAsGuest();
                performPutFile(resourceId, dto).andExpect(status().isUnauthorized());
            }

            @Test
            void update_Link_User_Success() throws Exception {
                ResourceDtoFormUpdate dto = new ResourceDtoFormUpdate("name", "desc", userId, null, "URL");
                performAs(Role.USER, userId);
                performPutFile(resourceId, dto).andExpect(status().is2xxSuccessful());
            }

            @Test
            void update_Link_Moderator_Success() throws Exception {
                ResourceDtoFormUpdate dto = new ResourceDtoFormUpdate("name", "desc", userId, null, "URL");
                performAs(Role.MODERATOR, userId);
                performPutFile(resourceId, dto).andExpect(status().is2xxSuccessful());
            }

            @Test
            void update_Link_Admin_Success() throws Exception {
                ResourceDtoFormUpdate dto = new ResourceDtoFormUpdate("name", "desc", userId, null, "URL");
                performAs(Role.ADMIN, userId);
                performPutFile(resourceId, dto).andExpect(status().is2xxSuccessful());
            }

            @Test
            void update_ResourceToResource_User_TypeTest_Equal() throws Exception {
                ResourceType previousType =
                        fileResourceRepository.findById(resourceId).get().getResourceType();
                ResourceDtoFormUpdate dto =
                        new ResourceDtoFormUpdate("name", "desc", userId, createMockMultipartFile(), null);
                performAs(Role.USER, userId);
                performPutFile(resourceId, dto).andExpect(status().is2xxSuccessful());
                ResourceType currentType =
                        fileResourceRepository.findById(resourceId).get().getResourceType();
                Assert.isTrue(previousType.equals(currentType));
            }

            @Test
            void update_ResourceToLink_User_TypeTest_Equal() throws Exception {
                ResourceType previousType =
                        fileResourceRepository.findById(resourceId).get().getResourceType();
                ResourceDtoFormUpdate dto = new ResourceDtoFormUpdate("name", "desc", userId, null, "URL");
                performAs(Role.USER, userId);
                performPutFile(resourceId, dto).andExpect(status().is2xxSuccessful());
                ResourceType currentType =
                        fileResourceRepository.findById(resourceId).get().getResourceType();
                Assert.isTrue(
                        previousType.equals(ResourceType.FILE) && currentType.equals(ResourceType.LINK));
            }

            @Test
            void update_LinkToLink_User_TypeTest_NotEqual() throws Exception {
                FileResource file = fileResourceRepository.findById(resourceId).get();
                file.setResourceType(ResourceType.LINK);
                fileResourceRepository.save(file);
                ResourceType previousType =
                        fileResourceRepository.findById(resourceId).get().getResourceType();
                ResourceDtoFormUpdate dto = new ResourceDtoFormUpdate("name", "desc", userId, null, "URL");
                performAs(Role.USER, userId);
                performPutFile(resourceId, dto).andExpect(status().is2xxSuccessful());
                ResourceType currentType =
                        fileResourceRepository.findById(resourceId).get().getResourceType();
                Assert.isTrue(previousType.equals(currentType));
            }

            @Test
            void update_LinkToResource_User_TypeTest_NotEqual() throws Exception {
                var linkResource =
                        new FileResource(
                                88L,
                                "Test File",
                                "Test decription",
                                "test path",
                                "test filetype",
                                1L,
                                ResourceType.LINK,
                                Timestamp.from(Instant.now()),
                                Timestamp.from(Instant.now()),
                                userRepository.getReferenceById(userId),
                                Set.of(pageRepository.getReferenceById(pageId)));
                linkResource = fileResourceRepository.save(linkResource);
                ResourceType previousType = linkResource.getResourceType();
                ResourceDtoFormUpdate dto =
                        new ResourceDtoFormUpdate("name", "desc", userId, createMockMultipartFile(), null);
                performAs(Role.USER, userId);
                performPutFile(linkResource.getId(), dto).andExpect(status().is2xxSuccessful());
                ResourceType currentType =
                        fileResourceRepository.findById(linkResource.getId()).get().getResourceType();
                Assert.isTrue(
                        previousType.equals(ResourceType.LINK) && currentType.equals(ResourceType.FILE));
            }
        }

        @Nested
        class DeleteResourceTestClass {

            private void clearFileResourcePages() {
                FileResource file = fileResourceRepository.findById(resourceId).get();
                file.setPages(new HashSet<Page>());
                fileResourceRepository.save(file);
            }

            @Test
            void delete_Resource_GuestUser_unauthorized() throws Exception {
                performAsGuest();
                performDelete(resourceId).andExpect(status().isUnauthorized());
            }

            @Test
            void delete_Resource_User_Success() throws Exception {
                clearFileResourcePages();
                performAs(Role.USER, userId);
                performDelete(resourceId).andExpect(status().is2xxSuccessful());
            }

            @Test
            void delete_Resource_Moderator_Success() throws Exception {
                clearFileResourcePages();
                performAs(Role.MODERATOR, userId);
                performDelete(resourceId).andExpect(status().is2xxSuccessful());
            }

            @Test
            void delete_Resource_Admin_Success() throws Exception {
                clearFileResourcePages();
                performAs(Role.ADMIN, userId);
                performDelete(resourceId).andExpect(status().is2xxSuccessful());
            }

            @Test
            void delete_Link_GuestUser_unauthorized() throws Exception {
                clearFileResourcePages();
                performAsGuest();
                performDelete(resourceId).andExpect(status().isUnauthorized());
            }

            @Test
            void delete_Link_User_Success() throws Exception {
                clearFileResourcePages();
                performAs(Role.USER, userId);
                performDelete(resourceId).andExpect(status().is2xxSuccessful());
            }

            @Test
            void delete_Link_Moderator_Success() throws Exception {
                clearFileResourcePages();
                performAs(Role.MODERATOR, userId);
                performDelete(resourceId).andExpect(status().is2xxSuccessful());
            }

            @Test
            void delete_Link_Admin_Success() throws Exception {
                clearFileResourcePages();
                performAs(Role.ADMIN, userId);
                performDelete(resourceId).andExpect(status().is2xxSuccessful());
            }
        }
    }
}
