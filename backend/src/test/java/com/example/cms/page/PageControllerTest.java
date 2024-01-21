package com.example.cms.page;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.cms.BaseAPIControllerTest;
import com.example.cms.page.projections.PageDtoDetailed;
import com.example.cms.page.projections.PageDtoFormCreate;
import com.example.cms.page.projections.PageDtoFormUpdate;
import com.example.cms.security.Role;
import com.example.cms.university.University;
import com.example.cms.university.UniversityRepository;
import com.example.cms.user.User;
import com.fasterxml.jackson.core.type.TypeReference;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class PageControllerTest extends BaseAPIControllerTest {
    @Autowired private UniversityRepository universityRepository;

    @Autowired private PageRepository pageRepository;

    private Long universityId = 99L;
    private Long mainPageId = 99L;
    private Long pageId = 99L;
    private Long userId = 99L;

    @Override
    protected String getUrl() {
        return "/api/pages";
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

        var mainPage =
                new Page(
                        "TEST_MAIN_PAGE",
                        "TEST_MAIN_PAGE",
                        new Content(null, "TEST_CONTENT"),
                        false,
                        user,
                        university,
                        null);
        mainPage = pageRepository.save(mainPage);
        this.mainPageId = mainPage.getId();

        var page =
                new Page(
                        "TEST_PAGE",
                        "TEST_PAGE",
                        new Content(null, "TEST_CONTENT"),
                        false,
                        user,
                        university,
                        mainPage);
        page = pageRepository.save(page);
        this.pageId = page.getId();
    }

    @AfterEach
    public void cleanup() {
        if (pageRepository.existsById(this.mainPageId)) pageRepository.deleteById(this.mainPageId);

        if (universityRepository.existsById(this.universityId))
            universityRepository.deleteById(this.universityId);

        if (userRepository.existsById(this.userId)) userRepository.deleteById(this.userId);
    }

    @Nested
    class GetPageTestClass {
        @Nested
        class VisiblePageTestClass {
            @Test
            void get_visiblePage_GuestUser_DetailsHidden() throws Exception {
                performAsGuest();

                var dto =
                        getValue(performGet(mainPageId).andExpect(status().isOk()), PageDtoDetailed.class);

                assertThat(dto.getContactRequestHandlers(), is(nullValue()));
            }

            @Test
            void get_visiblePage_Administrator_DetailsVisible() throws Exception {
                performAs(Role.ADMIN);

                var dto =
                        getValue(performGet(mainPageId).andExpect(status().isOk()), PageDtoDetailed.class);

                assertThat(dto.getContactRequestHandlers(), is(notNullValue()));
            }

            @Test
            void get_visiblePage_UniversityAdministrator_DetailsVisible() throws Exception {
                performAs(Role.MODERATOR, Set.of(universityId));

                var dto =
                        getValue(performGet(mainPageId).andExpect(status().isOk()), PageDtoDetailed.class);

                assertThat(dto.getContactRequestHandlers(), is(notNullValue()));
            }

            @Test
            void get_visiblePage_UniversityAdministratorOfNoneUniversity_DetailsHidden()
                    throws Exception {
                performAs(Role.MODERATOR, Set.of());

                var dto =
                        getValue(performGet(mainPageId).andExpect(status().isOk()), PageDtoDetailed.class);

                assertThat(dto.getContactRequestHandlers(), is(nullValue()));
            }

            @Test
            void get_visiblePage_UniversityUserAndPageCreator_DetailsVisible() throws Exception {
                performAs(Role.MODERATOR, Set.of(universityId), userId);

                var dto =
                        getValue(performGet(mainPageId).andExpect(status().isOk()), PageDtoDetailed.class);

                assertThat(dto.getContactRequestHandlers(), is(notNullValue()));
            }

            @Test
            void get_visiblePage_UniversityUserNotPageCreator_DetailsVisible() throws Exception {
                performAs(Role.USER, Set.of(universityId), userId + 1);

                var dto =
                        getValue(performGet(mainPageId).andExpect(status().isOk()), PageDtoDetailed.class);

                assertThat(dto.getContactRequestHandlers(), is(notNullValue()));
            }
        }

        @Nested
        class NotVisiblePageTestClass {
            @BeforeEach
            public void setup() {
                var page = pageRepository.findById(mainPageId).get();
                page.setHidden(true);
                pageRepository.save(page);
            }

            @Test
            void get_hiddenPage_GuestUser_NotFound() throws Exception {
                performAsGuest();
                performGet(mainPageId).andExpect(status().isNotFound());
            }

            @Test
            void get_hiddenPage_Administrator_Success() throws Exception {
                performAs(Role.ADMIN);
                performGet(mainPageId).andExpect(status().isOk());
            }

            @Test
            void get_hiddenPage_UniversityAdministrator_Success() throws Exception {
                performAs(Role.MODERATOR, Set.of(universityId));
                performGet(mainPageId).andExpect(status().isOk());
            }

            @Test
            void get_hiddenPage_UniversityAdministratorOfNoneUniversity_NotFound() throws Exception {
                performAs(Role.MODERATOR);
                performGet(mainPageId).andExpect(status().isNotFound());
            }

            @Test
            void get_hiddenPage_UniversityUserAndPageCreator_Success() throws Exception {
                performAs(Role.USER, Set.of(universityId), userId);
                performGet(mainPageId).andExpect(status().isOk());
            }

            @Test
            void get_hiddenPage_UniversityUserNotPageCreator_Success() throws Exception {
                performAs(Role.USER, Set.of(universityId), userId + 1);
                performGet(mainPageId).andExpect(status().isOk());
            }
        }
    }

    @Nested
    class GetAllPagesWithFiltersTestClass {
        @Test
        void get_VisibleOnly_UniversityUser_SuccessOnlyVisibleAndAssignedUniversity() throws Exception {
            performAs(Role.USER, Set.of(universityId));

            var items =
                    getValue(
                            performGet("?hidden_eq=false").andExpect(status().isOk()),
                            new TypeReference<List<PageDtoDetailed>>() {});

            assertThat(items, everyItem(hasProperty("university", hasProperty("id", is(universityId)))));
            assertThat(items, everyItem(hasProperty("hidden", is(false))));
        }

        @Test
        void get_VisibleOnly_UniversityAdministrator_SuccessOnlyVisibleAndAssignedUniversity()
                throws Exception {
            performAs(Role.MODERATOR, Set.of(universityId));

            var items =
                    getValue(
                            performGet("?hidden_eq=false").andExpect(status().isOk()),
                            new TypeReference<List<PageDtoDetailed>>() {});

            assertThat(items.size(), greaterThan(0));
            assertThat(items, everyItem(hasProperty("university", hasProperty("id", is(universityId)))));
            assertThat(items, everyItem(hasProperty("hidden", is(false))));
        }

        @Test
        void get_VisibleOnly_Administrator_Success() throws Exception {
            performAs(Role.ADMIN);

            var items =
                    getValue(
                            performGet("?hidden_eq=false").andExpect(status().isOk()),
                            new TypeReference<List<PageDtoDetailed>>() {});

            assertThat(items.size(), greaterThan(0));
            assertThat(items, everyItem(hasProperty("hidden", is(false))));
        }

        @Test
        void get_HiddenOnly_Administrator_Success() throws Exception {
            performAs(Role.ADMIN);

            var items =
                    getValue(
                            performGet("?hidden_eq=true").andExpect(status().isOk()),
                            new TypeReference<List<PageDtoDetailed>>() {});

            assertThat(items.size(), greaterThan(0));
            assertThat(items, everyItem(hasProperty("hidden", is(true))));
        }

        @Test
        void get_TitleContainsP_Administrator_Success() throws Exception {
            performAs(Role.ADMIN);

            var items =
                    getValue(
                            performGet("?title_ct=P").andExpect(status().isOk()),
                            new TypeReference<List<PageDtoDetailed>>() {});

            assertThat(items.size(), greaterThan(0));
            assertThat(items, everyItem(hasProperty("title", containsStringIgnoringCase("P"))));
        }

        @Test
        void get_TitleContainsPAndVisibleOnly_Administrator_Success() throws Exception {
            performAs(Role.ADMIN);

            var items =
                    getValue(
                            performGet("?title_ct=P&hidden_eq=false").andExpect(status().isOk()),
                            new TypeReference<List<PageDtoDetailed>>() {});

            assertThat(items.size(), greaterThan(0));
            assertThat(items, everyItem(hasProperty("hidden", is(false))));
            assertThat(items, everyItem(hasProperty("title", containsStringIgnoringCase("P"))));
        }

        @Test
        void get_IdEquals2_Administrator_Success() throws Exception {
            performAs(Role.ADMIN);

            var items =
                    getValue(
                            performGet("?id_eq=2").andExpect(status().isOk()),
                            new TypeReference<List<PageDtoDetailed>>() {});

            assertThat(items.size(), greaterThan(0));
            assertThat(items, everyItem(hasProperty("id", is(2L))));
        }

        @Test
        void get_UniversityIdEquals1_Administrator_Success() throws Exception {
            performAs(Role.ADMIN);

            var items =
                    getValue(
                            performGet("?university_eq=1").andExpect(status().isOk()),
                            new TypeReference<List<PageDtoDetailed>>() {});

            assertThat(items.size(), greaterThan(0));
            assertThat(items, everyItem(hasProperty("university", hasProperty("id", is(1L)))));
        }
    }

    @Nested
    class GetAllPagesTestClass {
        @Test
        void get_allPages_UniversityUser_SuccessOnlyAssignedUniversity() throws Exception {
            performAs(Role.USER, Set.of(universityId));

            var items =
                    getValue(
                            performGet().andExpect(status().isOk()),
                            new TypeReference<List<PageDtoDetailed>>() {});

            assertThat(items, everyItem(hasProperty("university", hasProperty("id", is(universityId)))));
        }

        @Test
        void get_allPages_UniversityUserOfNoneUniversity_SuccessEmptyList() throws Exception {
            performAs(Role.USER);

            var items =
                    getValue(
                            performGet().andExpect(status().isOk()),
                            new TypeReference<List<PageDtoDetailed>>() {});

            assertThat(items, is(empty()));
        }

        @Test
        void get_allPages_Guest_Success_OnlyVisible() throws Exception {
            performAsGuest();
            var items =
                    getValue(
                            performGet().andExpect(status().isOk()),
                            new TypeReference<List<PageDtoDetailed>>() {});
            assertThat(items, everyItem(hasProperty("hidden", is(false))));
        }

        @Test
        void get_allPages_Administrator_Success() throws Exception {
            performAs(Role.ADMIN);
            performGet().andExpect(status().isOk());
        }

        @Test
        void get_allPages_UniversityAdministrator_SuccessOnlyAssignedUniversity() throws Exception {
            performAs(Role.MODERATOR, Set.of(universityId));

            var items =
                    getValue(
                            performGet().andExpect(status().isOk()),
                            new TypeReference<List<PageDtoDetailed>>() {});

            assertThat(items, everyItem(hasProperty("university", hasProperty("id", is(universityId)))));
        }

        @Test
        void get_allPages_UniversityAdministratorOfNoneUniversity_SuccessEmptyList() throws Exception {
            performAs(Role.MODERATOR);

            var items =
                    getValue(
                            performGet().andExpect(status().isOk()),
                            new TypeReference<List<PageDtoDetailed>>() {});

            assertThat(items, is(empty()));
        }
    }

    @Nested
    class UpdatePageTestClass {

        @Nested
        class UpdateUniversityMainPageTestClass {
            public PageDtoFormUpdate getUpdateForm() {
                var page = pageRepository.findById(mainPageId).get();

                return new PageDtoFormUpdate(
                        page.getTitle(),
                        page.getDescription(),
                        "TEST_UPDATED_CONTENT",
                        page.isHidden(),
                        page.getHandlers().stream().map(User::getId).collect(Collectors.toSet()),
                        page.getCreator().getId(),
                        Set.of());
            }

            @Test
            public void update_UniversityUser_Forbidden() throws Exception {
                performAs(Role.USER, Set.of(universityId));
                performPut(mainPageId, getUpdateForm()).andExpect(status().isForbidden());
            }

            @Test
            public void update_UniversityAdministrator_Success() throws Exception {
                performAs(Role.MODERATOR, Set.of(universityId));
                performPut(mainPageId, getUpdateForm()).andExpect(status().isNoContent());
            }

            @Test
            public void update_Administrator_Success() throws Exception {
                performAs(Role.ADMIN);
                performPut(mainPageId, getUpdateForm()).andExpect(status().isNoContent());
            }
        }

        @Nested
        class UpdateNotUniversityMainPageTestClass {
            public PageDtoFormUpdate getUpdateForm() {
                var page = pageRepository.findById(pageId).get();

                return new PageDtoFormUpdate(
                        page.getTitle(),
                        page.getDescription(),
                        "TEST_UPDATED_CONTENT",
                        page.isHidden(),
                        page.getHandlers().stream().map(User::getId).collect(Collectors.toSet()),
                        page.getCreator().getId(),
                        Set.of());
            }

            @Test
            public void update_UniversityUser_Success() throws Exception {
                performAs(Role.USER, Set.of(universityId));
                performPut(pageId, getUpdateForm()).andExpect(status().is2xxSuccessful());
            }

            @Test
            public void update_UniversityAdministrator_Success() throws Exception {
                performAs(Role.MODERATOR, Set.of(universityId));
                performPut(pageId, getUpdateForm()).andExpect(status().is2xxSuccessful());
            }

            @Test
            public void update_Administrator_Success() throws Exception {
                performAs(Role.ADMIN);
                performPut(pageId, getUpdateForm()).andExpect(status().is2xxSuccessful());
            }
        }

        @Nested
        class UpdatePageCreatorTestClass {
            public PageDtoFormUpdate getUpdateForm(Long creatorId) {
                var page = pageRepository.findById(pageId).get();

                return new PageDtoFormUpdate(
                        page.getTitle(),
                        page.getDescription(),
                        "TEST_CONTENT",
                        page.isHidden(),
                        page.getHandlers().stream().map(User::getId).collect(Collectors.toSet()),
                        creatorId,
                        Set.of());
            }

            @Test
            public void update_CreatorInTheSameUniversityAsPage_Success() throws Exception {
                performAs(Role.ADMIN);
                performPut(pageId, getUpdateForm(userId)).andExpect(status().is2xxSuccessful());
            }

            @Test
            public void update_CreatorNotInTheSameUniversityAsPage_BadRequest() throws Exception {
                performAs(Role.ADMIN);
                performPut(pageId, getUpdateForm(1L)).andExpect(status().isBadRequest());
            }
        }
    }

    @Nested
    class CreatePageTestClass {
        private PageDtoFormCreate dto;

        @BeforeEach
        public void setup() {
            dto =
                    new PageDtoFormCreate(
                            "TEST_PAGE" + Instant.now().toEpochMilli(),
                            "TEST_PAGE_DESCRIPTION",
                            "TEST_PAGE_CONTENT",
                            userId,
                            mainPageId,
                            false);
        }

        @Test
        void create_GuestUser_Unauthorized() throws Exception {
            performAsGuest();
            performPost(dto).andExpect(status().isUnauthorized());
        }

        @Test
        void create_UniversityUserOfNoneUniversity_Forbidden() throws Exception {
            performAs(Role.USER);
            performPost(dto).andExpect(status().isForbidden());
        }

        @Test
        void create_UniversityUser_Success() throws Exception {
            performAs(Role.USER, Set.of(universityId));
            performPost(dto).andExpect(status().is2xxSuccessful());
        }

        @Test
        void create_UniversityAdministratorOfNoneUniversity_Forbidden() throws Exception {
            performAs(Role.MODERATOR);
            performPost(dto).andExpect(status().isForbidden());
        }

        @Test
        void create_UniversityAdministrator_Success() throws Exception {
            performAs(Role.MODERATOR, Set.of(universityId));
            performPost(dto).andExpect(status().is2xxSuccessful());
        }

        @Test
        void create_Administrator_Success() throws Exception {
            performAs(Role.ADMIN);
            performPost(dto).andExpect(status().is2xxSuccessful());
        }

        @Test
        void create_WithNoParent_BadRequest() throws Exception {
            performAs(Role.ADMIN);
            var dtoNoParent =
                    new PageDtoFormCreate(
                            dto.getTitle(),
                            dto.getDescription(),
                            dto.getContent(),
                            dto.getCreatorId(),
                            null,
                            dto.getHidden());
            performPost(dtoNoParent).andExpect(status().isBadRequest());
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
        void delete_UniversityUser_Success() throws Exception {
            performAs(Role.USER, Set.of(universityId));
            performDelete(pageId).andExpect(status().is2xxSuccessful());
        }

        @Test
        void delete_UniversityAdministrator_Success() throws Exception {
            performAs(Role.MODERATOR, Set.of(universityId));
            performDelete(pageId).andExpect(status().is2xxSuccessful());
        }

        @Test
        void delete_Administrator_Success() throws Exception {
            performAs(Role.ADMIN);
            performDelete(pageId).andExpect(status().is2xxSuccessful());
        }
    }
}
