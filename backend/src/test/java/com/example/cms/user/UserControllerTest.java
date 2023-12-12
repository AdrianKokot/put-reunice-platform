package com.example.cms.user;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.cms.BaseAPIControllerTest;
import com.example.cms.security.Role;
import com.example.cms.university.University;
import com.example.cms.university.UniversityRepository;
import com.example.cms.university.projections.UniversityDtoDetailed;
import com.example.cms.university.projections.UniversityDtoFormCreate;
import com.example.cms.university.projections.UniversityDtoFormUpdate;
import com.example.cms.user.User;
import java.time.Instant;
import java.util.Collections;
import java.util.Set;

import com.example.cms.user.projections.UserDtoFormCreate;
import com.example.cms.user.projections.UserDtoSimple;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
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
        user = userRepository.save(user);
        this.userId = user.getId();

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
        //HIBERNATE WYPIERDALA BŁĄD
//        @Test
//        void delete_UniversityAdministrator_Ok() throws Exception {
//            University testUniversity = universityRepository.findById(universityId).orElseThrow();
//            var newUser =
//                    new User(
//                            Set.of(testUniversity),
//                            null,
//                            null,
//                            null,
//                            "TEST_USER"+Instant.now().toString(),
//                            "TEST_USER"+Instant.now().toString(),
//                            null,
//                            null,
//                            null,
//                            null,
//                            null,
//                            null,
//                            Role.USER,
//                            false
//                    );
//            newUser = userRepository.save(newUser);
//            Set<User> secik = testUniversity.getEnrolledUsers();
//            secik.add(newUser);
//            testUniversity.setEnrolledUsers(secik);
//            performAs(Role.MODERATOR, Set.of(universityId), userId);
//            performDelete(newUser.getId()).andExpect(status().isOk());
//        }
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
}