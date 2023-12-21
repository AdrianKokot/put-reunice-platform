package com.example.cms.user;

import com.example.cms.BaseAPIControllerTest;
import com.example.cms.security.Role;
import com.example.cms.university.University;
import com.example.cms.university.UniversityRepository;
import com.example.cms.user.projections.UserDtoDetailed;
import com.example.cms.user.projections.UserDtoFormCreate;
import com.example.cms.user.projections.UserDtoFormUpdate;
import com.fasterxml.jackson.core.type.TypeReference;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Set;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class UserControllerTest extends BaseAPIControllerTest {

    @Autowired private UniversityRepository universityRepository;

    public Long universityId = 99L;
    private Long userId = 99L;

    @Override
    protected String getUrl() {
        return "/api/users";
    }

    @Override
    protected void setupData() {

        var user =
                new User(
                        null,
                        null,
                        null,
                        null,
                        "TEST_USER",
                        "TEST_USER",
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        Role.USER,
                        true);
        var university =
                new University(
                        null,
                        null,
                        null,
                        "TEST_UNIVERSITY" + Instant.now().toString(),
                        "TST_U" + Instant.now().toString(),
                        null,
                        null,
                        "TEST_UNIVERSITY",
                        false,
                        "");
        university = universityRepository.save(university);
        user = userRepository.save(user);
        this.userId = user.getId();

        this.universityId = university.getId();

    }

    @AfterEach
    public void cleanup() {
        if (userRepository.existsById(this.userId)) userRepository.deleteById(this.userId);
        if (universityRepository.existsById(this.universityId))
            universityRepository.deleteById(this.universityId);
    }

    @Nested
    class CreateAdministratorTestClass {
        private UserDtoFormCreate dto;

        @BeforeEach
        public void setup() {
            dto = new UserDtoFormCreate(
                    "TEST_USER" + Instant.now().toString(),
                    "Password123!",
                    "John",
                    "Doe",
                    "test@example.com",
                    "123456789",
                    true,
                    Role.ADMIN,
                    null
            );
        }
        @Test
        void create_User_Forbidden() throws Exception {
            performAs(Role.USER, userId);
            performPost(dto).andExpect(status().isForbidden());
        }
        @Test
        void create_UniversityAdministrator_Forbidden() throws Exception {
            performAs(Role.MODERATOR, userId);
            performPost(dto).andExpect(status().isForbidden());
        }
        @Test
        void create_Administrator_Created() throws Exception {
            performAs(Role.ADMIN, userId);
            performPost(dto).andExpect(status().isCreated());
        }
    }

    @Nested
    class CreateUniversityAdministratorTestClass {
        private UserDtoFormCreate dto;

        @BeforeEach
        public void setup() {
            dto = new UserDtoFormCreate(
                    "TEST_USER" + Instant.now().toString(),
                    "Password123!",
                    "John",
                    "Doe",
                    "test@example.com",
                    "123456789",
                    true,
                    Role.MODERATOR,
                    Collections.singleton(universityId)
            );
        }
        @Test
        void create_User_Forbidden() throws Exception {
            performAs(Role.USER, userId);
            performPost(dto).andExpect(status().isForbidden());
        }
        @Test
        void create_UniversityAdministrator_Forbidden() throws Exception {
            performAs(Role.MODERATOR, userId);
            performPost(dto).andExpect(status().isForbidden());
        }
        @Test
        void create_UniversityAdministrator_Created() throws Exception {
            performAs(Role.MODERATOR, Set.of(universityId), userId);
            performPost(dto).andExpect(status().isCreated());
        }
        @Test
        void create_Administrator_Created() throws Exception {
            performAs(Role.ADMIN, userId);
            performPost(dto).andExpect(status().isCreated());
        }
    }
    @Nested
    class CreateUserTestClass {
        private UserDtoFormCreate dto;
        @BeforeEach
        public void setup() {

            dto = new UserDtoFormCreate(
                    "TEST_USER" + Instant.now().toString(),
                    "Password123!",
                    "John",
                    "Doe",
                    "test@example.com",
                    "123456789",
                    true,
                    Role.USER,
                    Collections.singleton(universityId)
            );
        }
        @Test
        void create_User_Forbidden() throws Exception {
            performAs(Role.USER, userId);
            performPost(dto).andExpect(status().isForbidden());
        }
        @Test
        void create_UniversityAdministrator_Created() throws Exception {
            performAs(Role.MODERATOR, Set.of(universityId), userId);
            performPost(dto).andExpect(status().isCreated());
        }
        @Test
        void create_UniversityAdministrator_IsForbidden() throws Exception {
            performAs(Role.MODERATOR, userId);
            performPost(dto).andExpect(status().isForbidden());
        }
        @Test
        void create_Administrator_Created() throws Exception {
            performAs(Role.ADMIN, userId);
            performPost(dto).andExpect(status().isCreated());
        }
    }

    @Nested
    class DeleteUserTestClass {
        @Test
        void delete_User_Forbidden() throws Exception {
            performAs(Role.USER, userId);
            performDelete(userId).andExpect(status().isForbidden());
        }

        @Test
        void delete_UniversityAdministrator_Ok() throws Exception {
            var newUniversity =
                    new University(
                            null,
                            null,
                            null,
                            "TEST_NAME"+Instant.now().toString(),
                            "SHORT_NAME"+Instant.now().toString(),
                            null,
                            null,
                            "TEST_DESCRIPTION"+Instant.now().toString(),
                            false,
                            null
                            );
            newUniversity =  universityRepository.save(newUniversity);
            var newUser =
                    new User(
                            null,
                            null,
                            null,
                            null,
                            "TEST_USER"+Instant.now().toString(),
                            "TEST_USER"+Instant.now().toString(),
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            Role.USER,
                            false
                    );
            var newModerator =
                    new User(
                            null,
                            null,
                            null,
                            null,
                            "TEST_MODERATOR"+Instant.now().toString(),
                            "TEST_MODERATOR"+Instant.now().toString(),
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            Role.MODERATOR,
                            true
                    );
            newUser = userRepository.save(newUser);
            newModerator = userRepository.save(newModerator);
            newUniversity.setEnrolledUsers(Set.of(newUser,newModerator));

            universityRepository.save(newUniversity);
            performAs(Role.MODERATOR, Set.of(newUniversity.getId()), newModerator.getId());
            performDelete(newUser.getId()).andExpect(status().is2xxSuccessful());
        }
        @Test
        void delete_UniversityAdministrator_IsForbidden() throws Exception {
            performAs(Role.MODERATOR, userId);
            performDelete(userId).andExpect(status().isForbidden());
        }
        @Test
        void delete_Administrator_Ok() throws Exception {
            var newUser =
                    new User(
                            null,
                            null,
                            null,
                            null,
                            "TEST_USER"+Instant.now().toString(),
                            "TEST_USER",
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            Role.USER,
                            false
                    );
            newUser = userRepository.save(newUser);
            performAs(Role.ADMIN, userId);
            performDelete(newUser.getId()).andExpect(status().is2xxSuccessful());
        }

        @Test
        void delete_Administrator_Error() throws Exception {
            var newUser =
                    new User(
                           null,
                            null,
                            null,
                            null,
                            "TEST_USER"+Instant.now().toString(),
                            "TEST_USER"+Instant.now().toString(),
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            Role.USER,
                            true
                    );
            newUser = userRepository.save(newUser);
            performAs(Role.ADMIN, userId);
            performDelete(newUser.getId()).andExpect(status().is4xxClientError());
        }
    }
    @Nested
    class ViewUsersListTestClass {
        //tu coś jest źle, każdy widzi wszystko
        @Test
        void getUserList_User_Approve() throws Exception {
            performAs(Role.USER, userId);
            var items =
                    getValue(
                            performGet().andExpect(status().isOk()),
                            new TypeReference<List<UserDtoDetailed>>() {});
        }
        @Test
        void getUserList_UniversityAdmin_Approve() throws Exception {
            performAs(Role.MODERATOR, userId);
            performGet(userId).andExpect(status().is2xxSuccessful());
        }
        @Test
        void getUserList_UniversityAdmin_Forbidden() throws Exception {
            performAs(Role.MODERATOR, userId);
            performGet(userId).andExpect(status().is2xxSuccessful());
        }
        @Test
        void getUserList_Admin_Approve() throws Exception {
            performAs(Role.ADMIN, userId);
            performGet(userId).andExpect(status().is2xxSuccessful());
        }
    }

    @Nested
    class UpdateUserTestClass {
        private User userToUpdate;
        @BeforeEach
        public void setup() {

            userToUpdate = new User(
                    null,
                    null,
                    null,
                    null,
                    "TEST_USER"+Instant.now().toString(),
                    "TEST_user1!"+Instant.now().toString(),
                    "TEST_USER",
                    "null",
                    null,
                    "null@wp.pl",
                    "000000000",
                    "null",
                    Role.USER,
                    false
            );
            userToUpdate = userRepository.save(userToUpdate);
            userToUpdate.setEnrolledUniversities(Set.of(universityRepository.findById(universityId).orElseThrow()));
            userToUpdate = userRepository.save(userToUpdate);
        }
        public UserDtoFormUpdate getUpdateForm() {

            return new UserDtoFormUpdate(
                    userToUpdate.getFirstName(),
                    userToUpdate.getLastName(),
                    userToUpdate.getEmail(),
                    userToUpdate.getPhoneNumber(),
                    userToUpdate.getDescription(),
                    Set.of(universityId.longValue()),
                    userToUpdate.isEnabled(),
                    userToUpdate.getAccountType(),
                    userToUpdate.getUsername(),
                    userToUpdate.getPassword()
                    );
        }

        @Test
        public void update_UniversityUser_Forbidden() throws Exception {
            performAs(Role.USER, userId);
            performPut(userToUpdate.getId(), getUpdateForm()).andExpect(status().isForbidden());
        }

        @Test
        public void update_UniversityAdministrator_otherUniversityUser_Forbidden() throws Exception {
            performAs(Role.MODERATOR, userId);
            performPut(userToUpdate.getId(), getUpdateForm()).andExpect(status().isForbidden());
        }
        @Test
        public void updateToAdmin_UniversityAdministrator_Forbidden() throws Exception {
            performAs(Role.MODERATOR, Set.of(universityId), userId);
            userToUpdate.setAccountType(Role.ADMIN);
            performPut(userToUpdate.getId(), getUpdateForm()).andExpect(status().isForbidden());
        }
        @Test
        public void update_UniversityAdministrator_Success() throws Exception {
            performAs(Role.MODERATOR, Set.of(universityId));
            performPut(userToUpdate.getId(), getUpdateForm()).andExpect(status().is2xxSuccessful());
        }

        @Test
        public void update_Administrator_Success() throws Exception {
            performAs(Role.ADMIN);
            performPut(userToUpdate.getId(), getUpdateForm()).andExpect(status().is2xxSuccessful());
        }
    }

    @Nested
    class DisAbleUserTestClass {
        private User userToUpdate;
        @BeforeEach
        public void setup() {

            userToUpdate = new User(
                    null,
                    null,
                    null,
                    null,
                    "TEST_USER"+Instant.now().toString(),
                    "TEST_user1!"+Instant.now().toString(),
                    "TEST_USER",
                    "null",
                    null,
                    "null@wp.pl",
                    "000000000",
                    "null",
                    Role.USER,
                    false
            );
            userToUpdate = userRepository.save(userToUpdate);
            userToUpdate.setEnrolledUniversities(Set.of(universityRepository.findById(universityId).orElseThrow()));
            userToUpdate = userRepository.save(userToUpdate);
        }

        @Test
        public void enable_User_Forbidden() throws Exception {
            performAs(Role.USER, userId);
            boolean enabled = true;
            performPatch(userToUpdate.getId(),"/enabled", enabled).andExpect(status().isForbidden());
        }

        @Test
        public void enable_UniversityUser_Forbidden() throws Exception {
            performAs(Role.MODERATOR, userId);
            boolean enabled = true;
            performPatch(userToUpdate.getId(),"/enabled", enabled).andExpect(status().isForbidden());
        }
        @Test
        public void enable_UniversityUser_Success() throws Exception {
            performAs(Role.MODERATOR, Set.of(universityId), userId);
            boolean enabled = true;
            performPatch(userToUpdate.getId(),"/enabled", enabled).andExpect(status().is2xxSuccessful());
        }
        @Test
        public void enable_Administrator_Success() throws Exception {
            performAs(Role.ADMIN, userId);
            boolean enabled = true;
            performPatch(userToUpdate.getId(),"/enabled", enabled).andExpect(status().is2xxSuccessful());
        }
        @Test
        public void disable_User_Forbidden() throws Exception {
            performAs(Role.USER, userId);
            boolean enabled = false;
            performPatch(userToUpdate.getId(),"/enabled", enabled).andExpect(status().isForbidden());
        }

        @Test
        public void disable_UniversityUser_Forbidden() throws Exception {
            performAs(Role.MODERATOR, userId);
            boolean enabled = false;
            performPatch(userToUpdate.getId(),"/enabled", enabled).andExpect(status().isForbidden());
        }
        @Test
        public void disable_UniversityUser_Success() throws Exception {
            performAs(Role.MODERATOR, Set.of(universityId), userId);
            boolean enabled = false;
            performPatch(userToUpdate.getId(),"/enabled", enabled).andExpect(status().is2xxSuccessful());
        }
        @Test
        public void disable_Administrator_Success() throws Exception {
            performAs(Role.ADMIN, userId);
            boolean enabled = false;
            performPatch(userToUpdate.getId(),"/enabled", enabled).andExpect(status().is2xxSuccessful());
        }
    }
}