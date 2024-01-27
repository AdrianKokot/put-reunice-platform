package com.example.cms.resource;

import com.example.cms.BaseAPIControllerTest;
import com.example.cms.page.Content;
import com.example.cms.page.Page;
import com.example.cms.page.PageRepository;
import com.example.cms.resource.projections.ResourceDtoFormCreate;
import com.example.cms.resource.projections.ResourceDtoFormUpdate;
import com.example.cms.security.Role;
import com.example.cms.university.University;
import com.example.cms.university.UniversityRepository;
import com.example.cms.user.User;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class ResourceControllerTest extends BaseAPIControllerTest {
    @Autowired private UniversityRepository universityRepository;

    @Autowired private PageRepository pageRepository;
    @Autowired private FileResourceRepository fileResourceRepository;

    private Long universityId = 99L;
    private Long pageId = 99L;
    private Long userId = 99L;
    private Long resourceId = 99L;

    @Override
    protected String getUrl() {
        return "/api/resources";
    }

    private MockMultipartFile createMockMultipartFile() throws IOException {
        String fileName = "file.txt";
        String content = "This is a test file content";
        return new MockMultipartFile("file", fileName, "application/octet-stream", content.getBytes(StandardCharsets.UTF_8));
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

        var fileResource =
                new FileResource(
                        1L,
                        "Test File",
                        "Test decription",
                        "test path",
                        "test filetype",
                        1L,
                        ResourceType.FILE,
                        Timestamp.from(Instant.now()),
                        Timestamp.from(Instant.now()),
                        user,
                        Set.of(page)
                );
        fileResource = fileResourceRepository.save(fileResource);
        this.resourceId = fileResource.getId();
    }
    @AfterEach
    public void cleanup() {
        fileResourceRepository.deleteAll();

        if (pageRepository.existsById(this.pageId))
            pageRepository.deleteById(this.pageId);

        if (userRepository.existsById(this.userId))
            userRepository.deleteById(this.userId);

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
                ResourceDtoFormCreate dto = new ResourceDtoFormCreate(
                        "name",
                        "desc",
                        userId,
                        createMockMultipartFile(),
                        null
                );
                performAsGuest();
                performPostFile(dto).andExpect(status().isUnauthorized());
            }

            @Test
            void create_Resource_User_Success() throws Exception {
                performAs(Role.USER, userId);
                ResourceDtoFormCreate dto = new ResourceDtoFormCreate(
                        "name",
                        "desc",
                        userId,
                        createMockMultipartFile(),
                        null
                );
                performPostFile(dto).andExpect(status().isOk());
            }

            @Test
            void create_Resource_Moderator_Success() throws Exception {
                performAs(Role.MODERATOR, userId);
                ResourceDtoFormCreate dto = new ResourceDtoFormCreate(
                        "name",
                        "desc",
                        userId,
                        createMockMultipartFile(),
                        null
                );
                performPostFile(dto).andExpect(status().isOk());
            }

            @Test
            void create_Resource_Admin_Success() throws Exception {
                performAs(Role.ADMIN, userId);
                ResourceDtoFormCreate dto = new ResourceDtoFormCreate(
                        "name",
                        "desc",
                        userId,
                        createMockMultipartFile(),
                        null
                );
                performPostFile(dto).andExpect(status().isOk());
            }

            @Test
            void create_Link_GuestUser_unauthorized() throws Exception {
                ResourceDtoFormCreate dto = new ResourceDtoFormCreate(
                        "name",
                        "desc",
                        userId,
                        null,
                        "URL"
                );
                performAsGuest();
                performPostFile(dto).andExpect(status().isUnauthorized());
            }

            @Test
            void create_Link_User_Success() throws Exception {
                performAs(Role.USER, userId);
                ResourceDtoFormCreate dto = new ResourceDtoFormCreate(
                        "name",
                        "desc",
                        userId,
                        null,
                        "URL"
                );
                performPostFile(dto).andExpect(status().isOk());
            }

            @Test
            void create_Link_Moderator_Success() throws Exception {
                performAs(Role.MODERATOR, userId);
                ResourceDtoFormCreate dto = new ResourceDtoFormCreate(
                        "name",
                        "desc",
                        userId,
                        null,
                        "URL"
                );
                performPostFile(dto).andExpect(status().isOk());
            }

            @Test
            void create_Link_Admin_Success() throws Exception {
                performAs(Role.ADMIN, userId);
                ResourceDtoFormCreate dto = new ResourceDtoFormCreate(
                        "name",
                        "desc",
                        userId,
                        null,
                        "URL"
                );
                performPostFile(dto).andExpect(status().isOk());
            }
        }

        @Nested
        class UpdateResourceTestClass {
            @Test
            void update_Resource_GuestUser_unauthorized() throws Exception {
                ResourceDtoFormUpdate dto = new ResourceDtoFormUpdate(
                        "name",
                        "desc",
                        userId,
                        createMockMultipartFile(),
                        null
                );
                performAsGuest();
                performPutFile(resourceId, dto).andExpect(status().isUnauthorized());
            }

            @Test
            void update_Resource_User_Success() throws Exception {
                ResourceDtoFormUpdate dto = new ResourceDtoFormUpdate(
                        "name",
                        "desc",
                        userId,
                        createMockMultipartFile(),
                        null
                );
                performAs(Role.USER, userId);
                performPutFile(resourceId, dto).andExpect(status().is2xxSuccessful());
            }

            @Test
            void update_Resource_Moderator_Success() throws Exception {
                ResourceDtoFormUpdate dto = new ResourceDtoFormUpdate(
                        "name",
                        "desc",
                        userId,
                        createMockMultipartFile(),
                        null
                );
                performAs(Role.MODERATOR, userId);
                performPutFile(resourceId, dto).andExpect(status().is2xxSuccessful());
            }

            @Test
            void update_Resource_Admin_Success() throws Exception {
                ResourceDtoFormUpdate dto = new ResourceDtoFormUpdate(
                        "name",
                        "desc",
                        userId,
                        createMockMultipartFile(),
                        null
                );
                performAs(Role.ADMIN, userId);
                performPutFile(resourceId, dto).andExpect(status().is2xxSuccessful());
            }

            @Test
            void update_Link_GuestUser_unauthorized() throws Exception {
                ResourceDtoFormUpdate dto = new ResourceDtoFormUpdate(
                        "name",
                        "desc",
                        userId,
                        null,
                        "URL"
                );
                performAsGuest();
                performPutFile(resourceId, dto).andExpect(status().isUnauthorized());
            }

            @Test
            void update_Link_User_Success() throws Exception {
                ResourceDtoFormUpdate dto = new ResourceDtoFormUpdate(
                        "name",
                        "desc",
                        userId,
                        null,
                        "URL"
                );
                performAs(Role.USER, userId);
                performPutFile(resourceId, dto).andExpect(status().is2xxSuccessful());
            }

            @Test
            void update_Link_Moderator_Success() throws Exception {
                ResourceDtoFormUpdate dto = new ResourceDtoFormUpdate(
                        "name",
                        "desc",
                        userId,
                        null,
                        "URL"
                );
                performAs(Role.MODERATOR, userId);
                performPutFile(resourceId, dto).andExpect(status().is2xxSuccessful());
            }

            @Test
            void update_Link_Admin_Success() throws Exception {
                ResourceDtoFormUpdate dto = new ResourceDtoFormUpdate(
                        "name",
                        "desc",
                        userId,
                        null,
                        "URL"
                );
                performAs(Role.ADMIN, userId);
                performPutFile(resourceId, dto).andExpect(status().is2xxSuccessful());
            }
        }
        @Nested
        class DeleteResourceTestClass {

            private void clearFileResourcePages(){
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
