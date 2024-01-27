package put.eunice.cms.page;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import put.eunice.cms.BaseAPIControllerTest;
import put.eunice.cms.page.global.GlobalPage;
import put.eunice.cms.page.global.GlobalPageRepository;
import put.eunice.cms.page.global.projections.GlobalPageDtoFormCreate;
import put.eunice.cms.page.global.projections.GlobalPageDtoFormUpdate;
import put.eunice.cms.security.Role;
import put.eunice.cms.user.User;

public class GlobalPageControllerTest extends BaseAPIControllerTest {
    @Autowired private GlobalPageRepository pageRepository;

    private Long userId = 99L;
    private Long pageId = 99L;

    @Override
    protected String getUrl() {
        return "/api/global-pages";
    }

    @Override
    public void setupData() {
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

        var page = new GlobalPage("TEST_PAGE", "TEST_PAGE", false);
        page = pageRepository.save(page);
        this.pageId = page.getId();
    }

    @AfterEach
    public void cleanup() {
        if (pageRepository.existsById(this.pageId)) pageRepository.deleteById(this.pageId);
        if (userRepository.existsById(this.userId)) userRepository.deleteById(this.userId);
    }

    @Nested
    class GetPageTestClass {
        @Nested
        class VisiblePageTestClass {
            @Test
            void get_visibleGlobalPage_GuestUser_Success() throws Exception {
                performAsGuest();
                performGet(pageId).andExpect(status().isOk());
            }

            @Test
            void get_visiblePage_Administrator_Success() throws Exception {
                performAs(Role.ADMIN);
                performGet(pageId).andExpect(status().isOk());
            }

            @Test
            void get_visiblePage_UniversityAdministrator_Success() throws Exception {
                performAs(Role.MODERATOR);
                performGet(pageId).andExpect(status().isOk());
            }

            @Test
            void get_visiblePage_UniversityUser_Success() throws Exception {
                performAs(Role.USER);
                performGet(pageId).andExpect(status().isOk());
            }
        }

        @Nested
        class NotVisiblePageTestClass {
            @BeforeEach
            public void setup() {
                var page = pageRepository.findById(pageId).get();
                page.setHidden(true);
                pageRepository.save(page);
            }

            @Test
            void get_hiddenPage_GuestUser_NotFond() throws Exception {
                performAsGuest();
                performGet(pageId).andExpect(status().isNotFound());
            }

            @Test
            void get_hiddenPage_Administrator_Success() throws Exception {
                performAs(Role.ADMIN);
                performGet(pageId).andExpect(status().isOk());
            }

            @Test
            void get_hiddenPage_UniversityAdministrator_NotFound() throws Exception {
                performAs(Role.MODERATOR);
                performGet(pageId).andExpect(status().isNotFound());
            }

            @Test
            void get_hiddenPage_UniversityUser_NotFound() throws Exception {
                performAs(Role.USER);
                performGet(pageId).andExpect(status().isNotFound());
            }
        }
    }

    @Nested
    class GetAllPagesTestClass {
        @Test
        void get_allPages_UniversityUser_Forbidden() throws Exception {
            performAs(Role.USER);
            performGet().andExpect(status().isForbidden());
        }

        @Test
        void get_allPages_Guest_Unauthorized() throws Exception {
            performAsGuest();
            performGet().andExpect(status().isUnauthorized());
        }

        @Test
        void get_allPages_Administrator_Success() throws Exception {
            performAs(Role.ADMIN);
            performGet().andExpect(status().isOk());
        }

        @Test
        void get_allPages_UniversityAdministrator_Forbidden() throws Exception {
            performAs(Role.MODERATOR);
            performGet().andExpect(status().isForbidden());
        }
    }

    @Nested
    class UpdatePageTestClass {
        public GlobalPageDtoFormUpdate getUpdateForm() {
            return new GlobalPageDtoFormUpdate("TEST_PAGE", "TEST_PAGE", false);
        }

        @Test
        void create_GuestUser_Unauthorized() throws Exception {
            performAsGuest();
            performPut(pageId, getUpdateForm()).andExpect(status().isUnauthorized());
        }

        @Test
        public void update_UniversityUser_Forbidden() throws Exception {
            performAs(Role.USER);
            performPut(pageId, getUpdateForm()).andExpect(status().isForbidden());
        }

        @Test
        public void update_UniversityAdministrator_Forbidden() throws Exception {
            performAs(Role.MODERATOR);
            performPut(pageId, getUpdateForm()).andExpect(status().isForbidden());
        }

        @Test
        public void update_Administrator_Success() throws Exception {
            performAs(Role.ADMIN);
            performPut(pageId, getUpdateForm()).andExpect(status().is2xxSuccessful());
        }
    }

    @Nested
    class CreatePageTestClass {
        private GlobalPageDtoFormCreate dto;

        @BeforeEach
        public void setup() {
            dto = new GlobalPageDtoFormCreate("TEST_PAGE", "TEST_PAGE", false);
        }

        @Test
        void create_GuestUser_Unauthorized() throws Exception {
            performAsGuest();
            performPost(dto).andExpect(status().isUnauthorized());
        }

        @Test
        void create_UniversityUser_Forbidden() throws Exception {
            performAs(Role.USER);
            performPost(dto).andExpect(status().isForbidden());
        }

        @Test
        void create_UniversityAdministrator_Forbidden() throws Exception {
            performAs(Role.MODERATOR);
            performPost(dto).andExpect(status().isForbidden());
        }

        @Test
        void create_Administrator_Success() throws Exception {
            performAs(Role.ADMIN);
            performPost(dto).andExpect(status().is2xxSuccessful());
        }
    }

    @Nested
    class DeletePageTestClass {
        @Test
        void delete_GuestUser_Unauthorized() throws Exception {
            performAsGuest();
            performDelete(pageId).andExpect(status().isUnauthorized());
        }

        @Test
        void delete_UniversityUser_Forbidden() throws Exception {
            performAs(Role.USER);
            performDelete(pageId).andExpect(status().isForbidden());
        }

        @Test
        void delete_UniversityAdministrator_Forbidden() throws Exception {
            performAs(Role.MODERATOR);
            performDelete(pageId).andExpect(status().isForbidden());
        }

        @Test
        void delete_Administrator_Success() throws Exception {
            performAs(Role.ADMIN);
            performDelete(pageId).andExpect(status().is2xxSuccessful());
        }

        @Test
        void delete_MainPage_Administrator_BadRequest() throws Exception {
            performAs(Role.ADMIN);
            performDelete(1L).andExpect(status().isBadRequest());
        }
    }
}
