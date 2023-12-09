package com.example.cms.page;

import com.example.cms.BaseAPIControllerTest;
import com.example.cms.page.projections.PageDtoDetailed;
import com.example.cms.page.projections.PageDtoFormUpdate;
import com.example.cms.security.Role;
import com.example.cms.university.University;
import com.example.cms.university.UniversityRepository;
import com.example.cms.user.User;
import com.fasterxml.jackson.core.type.TypeReference;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class PageControllerTest extends BaseAPIControllerTest {
    @Autowired
    private UniversityRepository universityRepository;

    @Autowired
    private PageRepository pageRepository;

    private Long universityId = 99L;
    private Long pageId = 99L;
    private Long userId = 99L;

    @Override
    protected String getUrl() {
        return "/api/pages";
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

        var university =
                new University(
                        null, null, null, "TEST_UNIVERSITY", "TST_U", null, null, "TEST_UNIVERSITY", false, "");
        university = universityRepository.save(university);
        this.universityId = university.getId();

        var page =
                new Page(
                        null,
                        null,
                        "TEST_PAGE",
                        "TEST_PAGE",
                        new Content(null, "TEST_CONTENT"),
                        false,
                        user,
                        university,
                        null,
                        null,
                        null,
                        null,
                        null);
        page = pageRepository.save(page);
        this.pageId = page.getId();
    }

    @AfterEach
    public void cleanup() {
        if (pageRepository.existsById(this.pageId))
            pageRepository.deleteById(this.pageId);
        if (universityRepository.existsById(this.universityId))
            universityRepository.deleteById(this.universityId);
        if (userRepository.existsById(this.userId)) userRepository.deleteById(this.userId);
    }

    @Nested
    class GetPageTestClass {
        @Nested
        class VisiblePageTestClass {
            @Test
            void get_GuestUser_DetailsHidden() throws Exception {
                performAsGuest();

                var dto = getValue(performGet(pageId).andExpect(status().isOk()), PageDtoDetailed.class);

                assertThat(dto.getContactRequestHandlers(), is(nullValue()));
            }

            @Test
            void get_AdminRole_DetailsVisible() throws Exception {
                performAs(Role.ADMIN);

                var dto = getValue(performGet(pageId).andExpect(status().isOk()), PageDtoDetailed.class);

                assertThat(dto.getContactRequestHandlers(), is(notNullValue()));
            }

            @Test
            void get_ModeratorRole_WithUniversityAccess_DetailsVisible() throws Exception {
                performAs(Role.MODERATOR, Set.of(universityId));

                var dto = getValue(performGet(pageId).andExpect(status().isOk()), PageDtoDetailed.class);

                assertThat(dto.getContactRequestHandlers(), is(notNullValue()));
            }

            @Test
            void get_ModeratorRole_WithoutUniversityAccess_DetailsHidden() throws Exception {
                performAs(Role.MODERATOR, Set.of());

                var dto = getValue(performGet(pageId).andExpect(status().isOk()), PageDtoDetailed.class);

                assertThat(dto.getContactRequestHandlers(), is(nullValue()));
            }

            @Test
            void get_UserRole_WithUniversityAccessAndPageCreator_DetailsVisible() throws Exception {
                performAs(Role.MODERATOR, Set.of(universityId), userId);

                var dto = getValue(performGet(pageId).andExpect(status().isOk()), PageDtoDetailed.class);

                assertThat(dto.getContactRequestHandlers(), is(notNullValue()));
            }

            @Test
            void get_UserRole_WithUniversityAccessAndNotPageCreator_DetailsVisible() throws Exception {
                performAs(Role.USER, Set.of(universityId), userId + 1);

                var dto = getValue(performGet(pageId).andExpect(status().isOk()), PageDtoDetailed.class);

                assertThat(dto.getContactRequestHandlers(), is(notNullValue()));
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
            void get_GuestUser_Forbidden() throws Exception {
                performAsGuest();
                performGet(pageId).andExpect(status().isForbidden());
            }

            @Test
            void get_AdminRole_Success() throws Exception {
                performAs(Role.ADMIN);
                performGet(pageId).andExpect(status().isOk());
            }

            @Test
            void get_ModeratorRole_WithUniversityAccess_Success() throws Exception {
                performAs(Role.MODERATOR, Set.of(universityId));
                performGet(pageId).andExpect(status().isOk());
            }

            @Test
            void get_ModeratorRole_WithoutUniversityAccess_Forbidden() throws Exception {
                performAs(Role.MODERATOR);
                performGet(pageId).andExpect(status().isForbidden());
            }

            @Test
            void get_UserRole_WithUniversityAccessAndPageCreator_Success() throws Exception {
                performAs(Role.USER, Set.of(universityId), userId);
                performGet(pageId).andExpect(status().isOk());
            }

            @Test
            void get_UserRole_WithUniversityAccessAndNotPageCreator_Success() throws Exception {
                performAs(Role.USER, Set.of(universityId), userId + 1);
                performGet(pageId).andExpect(status().isOk());
            }
        }
    }

    @Nested
    class GetPagesTestClass {
        @Test
        void getAll_GuestUser_Forbidden() throws Exception {
            performAsGuest();
            performGet().andExpect(status().isUnauthorized());
        }

        @Nested
        class GetPagesAdminRoleTestClass {
            @Test
            void getAll_AdminRole_Success() throws Exception {
                performAs(Role.ADMIN);
                performGet().andExpect(status().isOk());
            }

            @Test
            void getAll_AdminRole_FilterOnlyVisible_Success() throws Exception {
                performAs(Role.ADMIN);

                var items =
                        getValue(
                                performGet("?hidden_eq=false").andExpect(status().isOk()),
                                new TypeReference<List<PageDtoDetailed>>() {
                                });

                assertThat(items, everyItem(hasProperty("hidden", is(false))));
            }

            @Test
            void getAll_AdminRole_FilterOnlyHidden_Success() throws Exception {
                performAs(Role.ADMIN);

                var items =
                        getValue(
                                performGet("?hidden_eq=true").andExpect(status().isOk()),
                                new TypeReference<List<PageDtoDetailed>>() {
                                });

                assertThat(items, everyItem(hasProperty("hidden", is(true))));
            }
        }

        @Nested
        class GetPagesModeratorRoleTestClass {
            @Test
            void getAll_ModeratorRole_WithUniversityAccess_Success_OnlyForAssignedUniversity()
                    throws Exception {
                performAs(Role.MODERATOR, Set.of(universityId));

                var items = getValue(performGet().andExpect(status().isOk()), new TypeReference<List<PageDtoDetailed>>() {
                });

                assertThat(
                        items, everyItem(hasProperty("university", hasProperty("id", is(universityId)))));
            }

            @Test
            void getAll_ModeratorRole_WithUniversityAccess_FilterOnlyVisible_Success() throws Exception {
                performAs(Role.MODERATOR, Set.of(universityId));

                var items = getValue(performGet("?hidden_eq=false").andExpect(status().isOk()), new TypeReference<List<PageDtoDetailed>>() {
                });

                assertThat(
                        items, everyItem(hasProperty("university", hasProperty("id", is(universityId)))));
                assertThat(items, everyItem(hasProperty("hidden", is(false))));
            }

            @Test
            void getAll_ModeratorRole_WithoutUniversityAccess_Success_EmptyList() throws Exception {
                performAs(Role.MODERATOR);

                var items = getValue(performGet().andExpect(status().isOk()), new TypeReference<List<PageDtoDetailed>>() {
                });

                assertThat(items, is(empty()));
            }
        }

        @Nested
        class GetPagesUserRoleTestClass {
            @Test
            void getAll_UserRole_WithUniversityAccess_Success_OnlyForAssignedUniversity()
                    throws Exception {
                performAs(Role.USER, Set.of(universityId));

                var items = getValue(performGet().andExpect(status().isOk()), new TypeReference<List<PageDtoDetailed>>() {
                });

                assertThat(
                        items, everyItem(hasProperty("university", hasProperty("id", is(universityId)))));
            }

            @Test
            void getAll_UserRole_WithUniversityAccess_FilterOnlyVisible_Success() throws Exception {
                performAs(Role.USER, Set.of(universityId));

                var items = getValue(performGet("?hidden_eq=false").andExpect(status().isOk()), new TypeReference<List<PageDtoDetailed>>() {
                });

                assertThat(
                        items, everyItem(hasProperty("university", hasProperty("id", is(universityId)))));
                assertThat(items, everyItem(hasProperty("hidden", is(false))));
            }

            @Test
            void getAll_UserRole_WithoutUniversityAccess_Success_EmptyList() throws Exception {
                performAs(Role.USER);

                var items = getValue(performGet().andExpect(status().isOk()), new TypeReference<List<PageDtoDetailed>>() {
                });

                assertThat(items, is(empty()));
            }
        }
    }

    @Nested
    class UpdatePageTestClass {

        @Nested
        class UpdateUniversityMainPageTestClass {
            public PageDtoFormUpdate getUpdateForm() {
                var page = pageRepository.findById(pageId).get();

                return new PageDtoFormUpdate(
                        page.getTitle(),
                        page.getDescription(),
                        "TEST_UPDATED_CONTENT",
                        page.isHidden(),
                        page.getHandlers().stream().map(User::getId).collect(Collectors.toSet()),
                        page.getCreator().getId());
            }

            @Test
            public void update_UniversityUser_Forbidden() throws Exception {
                performAs(Role.USER, Set.of(universityId));
                performPut(pageId, getUpdateForm()).andExpect(status().isForbidden());
            }

            @Test
            public void update_UniversityAdministrator_Success() throws Exception {
                performAs(Role.MODERATOR, Set.of(universityId));
                performPut(pageId, getUpdateForm()).andExpect(status().isNoContent());
            }

            @Test
            public void update_Administrator_Success() throws Exception {
                performAs(Role.ADMIN);
                performPut(pageId, getUpdateForm()).andExpect(status().isNoContent());
            }
        }
    }
}
