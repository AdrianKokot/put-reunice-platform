package com.example.cms.page;

import com.example.cms.development.CustomAuthenticationToken;
import com.example.cms.page.projections.PageDtoDetailed;
import com.example.cms.security.Role;
import com.example.cms.university.University;
import com.example.cms.university.UniversityRepository;
import com.example.cms.user.User;
import com.example.cms.user.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Set;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@AutoConfigureMockMvc()
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("secured, h2")
class PageControllerTest {
    @Autowired
    private MockMvc mvc;
    private SecurityContext ctx;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UniversityRepository universityRepository;

    @Autowired
    private PageRepository pageRepository;

    @Autowired
    private UserRepository userRepository;


    private Long universityId = 99L;
    private Long pageId = 99L;
    private Long userId = 99L;

    private void setupData() {
        var user = new User(null, null, null, null, "TEST_USER", "TEST_USER", null, null, null, null, null, null, Role.USER, true);
        user = userRepository.save(user);
        this.userId = user.getId();

        var university = new University(null, null, null, "TEST_UNIVERSITY", "TST_U", null, null, "TEST_UNIVERSITY", false);
        university = universityRepository.save(university);
        this.universityId = university.getId();

        var page = new Page(null, null, "TEST_PAGE", "TEST_PAGE", new Content(null, "TEST_CONTENT"), false, user, university, null, null, null, null, null);
        page = pageRepository.save(page);
        this.pageId = page.getId();
    }

    @BeforeEach
    public void setup() {
        SecurityContextHolder.setContext(SecurityContextHolder.createEmptyContext());
        ctx = SecurityContextHolder.getContext();

        this.setupData();
    }

    @AfterEach
    public void cleanup() {
        pageRepository.deleteById(this.pageId);
        universityRepository.deleteById(this.universityId);
        userRepository.deleteById(this.userId);
    }

    @Nested
    class GetPageTestClass {
        @Nested
        class VisiblePageTestClass {
            @Test
            @WithMockUser(roles = "ANONYMOUS")
            void get_GuestUser_DetailsHidden() throws Exception {
                var result = mvc.perform(get("/api/pages/" + pageId).contentType(MediaType.APPLICATION_JSON))
                        .andExpect(status().isOk())
                        .andReturn();

                var dto = objectMapper.readValue(result.getResponse().getContentAsString(), PageDtoDetailed.class);
                assertThat(dto.getContactRequestHandlers(), is(nullValue()));
            }

            @Test
            void get_AdminRole_DetailsVisible() throws Exception {
                ctx.setAuthentication(CustomAuthenticationToken.create(Role.ADMIN, Set.of()));

                var result = mvc.perform(get("/api/pages/" + pageId).contentType(MediaType.APPLICATION_JSON))
                        .andExpect(status().isOk())
                        .andReturn();

                var dto = objectMapper.readValue(result.getResponse().getContentAsString(), PageDtoDetailed.class);

                assertThat(dto.getContactRequestHandlers(), is(notNullValue()));
            }

            @Test
            void get_ModeratorRole_WithUniversityAccess_DetailsVisible() throws Exception {
                ctx.setAuthentication(CustomAuthenticationToken.create(Role.MODERATOR, Set.of(universityId)));

                var result = mvc.perform(get("/api/pages/" + pageId).contentType(MediaType.APPLICATION_JSON))
                        .andExpect(status().isOk())
                        .andReturn();

                var dto = objectMapper.readValue(result.getResponse().getContentAsString(), PageDtoDetailed.class);

                assertThat(dto.getContactRequestHandlers(), is(notNullValue()));
            }

            @Test
            void get_ModeratorRole_WithoutUniversityAccess_DetailsHidden() throws Exception {
                ctx.setAuthentication(CustomAuthenticationToken.create(Role.MODERATOR, Set.of()));

                var result = mvc.perform(get("/api/pages/" + pageId).contentType(MediaType.APPLICATION_JSON))
                        .andExpect(status().isOk())
                        .andReturn();

                var dto = objectMapper.readValue(result.getResponse().getContentAsString(), PageDtoDetailed.class);

                assertThat(dto.getContactRequestHandlers(), is(nullValue()));
            }

            @Test
            void get_UserRole_WithUniversityAccessAndPageCreator_DetailsVisible() throws Exception {
                ctx.setAuthentication(CustomAuthenticationToken.create(Role.USER, Set.of(universityId), userId));

                var result = mvc.perform(get("/api/pages/" + pageId).contentType(MediaType.APPLICATION_JSON))
                        .andExpect(status().isOk())
                        .andReturn();

                var dto = objectMapper.readValue(result.getResponse().getContentAsString(), PageDtoDetailed.class);

                assertThat(dto.getContactRequestHandlers(), is(notNullValue()));
            }

            @Test
            void get_UserRole_WithUniversityAccessAndNotPageCreator_DetailsHidden() throws Exception {
                ctx.setAuthentication(CustomAuthenticationToken.create(Role.USER, Set.of(universityId), userId + 1));

                var result = mvc.perform(get("/api/pages/" + pageId).contentType(MediaType.APPLICATION_JSON))
                        .andExpect(status().isOk())
                        .andReturn();

                var dto = objectMapper.readValue(result.getResponse().getContentAsString(), PageDtoDetailed.class);

                assertThat(dto.getContactRequestHandlers(), is(nullValue()));
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
            @WithMockUser(roles = "ANONYMOUS")
            void get_GuestUser_Forbidden() throws Exception {
                mvc.perform(get("/api/pages/" + pageId).contentType(MediaType.APPLICATION_JSON))
                        .andExpect(status().isForbidden())
                        .andReturn();
            }

            @Test
            void get_AdminRole_Success() throws Exception {
                ctx.setAuthentication(CustomAuthenticationToken.create(Role.ADMIN, Set.of()));

                mvc.perform(get("/api/pages/" + pageId).contentType(MediaType.APPLICATION_JSON))
                        .andExpect(status().isOk())
                        .andReturn();
            }

            @Test
            void get_ModeratorRole_WithUniversityAccess_Success() throws Exception {
                ctx.setAuthentication(CustomAuthenticationToken.create(Role.MODERATOR, Set.of(universityId)));

                mvc.perform(get("/api/pages/" + pageId).contentType(MediaType.APPLICATION_JSON))
                        .andExpect(status().isOk())
                        .andReturn();
            }

            @Test
            void get_ModeratorRole_WithoutUniversityAccess_Forbidden() throws Exception {
                ctx.setAuthentication(CustomAuthenticationToken.create(Role.MODERATOR, Set.of()));

                mvc.perform(get("/api/pages/" + pageId).contentType(MediaType.APPLICATION_JSON))
                        .andExpect(status().isForbidden())
                        .andReturn();
            }

            @Test
            void get_UserRole_WithUniversityAccessAndPageCreator_Success() throws Exception {
                ctx.setAuthentication(CustomAuthenticationToken.create(Role.USER, Set.of(universityId), userId));

                mvc.perform(get("/api/pages/" + pageId).contentType(MediaType.APPLICATION_JSON))
                        .andExpect(status().isOk())
                        .andReturn();
            }

            @Test
            void get_UserRole_WithUniversityAccessAndNotPageCreator_Forbidden() throws Exception {
                ctx.setAuthentication(CustomAuthenticationToken.create(Role.USER, Set.of(universityId), userId + 1));

                mvc.perform(get("/api/pages/" + pageId).contentType(MediaType.APPLICATION_JSON))
                        .andExpect(status().isForbidden())
                        .andReturn();
            }
        }
    }

    @Nested
    class GetPagesTestClass {
        @Test
        @WithMockUser(roles = "ANONYMOUS")
        void getAll_GuestUser_Forbidden() throws Exception {
            mvc.perform(get("/api/pages").contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isUnauthorized())
                    .andReturn();
        }

        @Nested
        class GetPagesAdminRoleTestClass {
            @Test
            void getAll_AdminRole_Success() throws Exception {
                ctx.setAuthentication(CustomAuthenticationToken.create(Role.ADMIN, Set.of()));

                mvc.perform(get("/api/pages").contentType(MediaType.APPLICATION_JSON))
                        .andExpect(status().isOk())
                        .andReturn();
            }

            @Test
            void getAll_AdminRole_FilterOnlyVisible_Success() throws Exception {
                ctx.setAuthentication(CustomAuthenticationToken.create(Role.ADMIN, Set.of()));

                var result = mvc.perform(get("/api/pages?hidden_eq=false").contentType(MediaType.APPLICATION_JSON))
                        .andExpect(status().isOk())
                        .andReturn();

                var items = objectMapper.readValue(result.getResponse().getContentAsString(), new TypeReference<List<PageDtoDetailed>>() {
                });

                assertThat(items, everyItem(hasProperty("hidden", is(false))));
            }

            @Test
            void getAll_AdminRole_FilterOnlyHidden_Success() throws Exception {
                ctx.setAuthentication(CustomAuthenticationToken.create(Role.ADMIN, Set.of()));

                var result = mvc.perform(get("/api/pages?hidden_eq=true").contentType(MediaType.APPLICATION_JSON))
                        .andExpect(status().isOk())
                        .andReturn();

                var items = objectMapper.readValue(result.getResponse().getContentAsString(), new TypeReference<List<PageDtoDetailed>>() {
                });

                assertThat(items, everyItem(hasProperty("hidden", is(true))));
            }
        }

        @Nested
        class GetPagesModeratorRoleTestClass {
            @Test
            void getAll_ModeratorRole_WithUniversityAccess_Success_OnlyForAssignedUniversity() throws Exception {
                ctx.setAuthentication(CustomAuthenticationToken.create(Role.MODERATOR, Set.of(universityId)));

                var result = mvc.perform(get("/api/pages").contentType(MediaType.APPLICATION_JSON))
                        .andExpect(status().isOk())
                        .andReturn();

                var items = objectMapper.readValue(result.getResponse().getContentAsString(), new TypeReference<List<PageDtoDetailed>>() {
                });

                assertThat(items, everyItem(hasProperty("university", hasProperty("id", is(universityId)))));
            }

            @Test
            void getAll_ModeratorRole_WithUniversityAccess_FilterOnlyVisible_Success() throws Exception {
                ctx.setAuthentication(CustomAuthenticationToken.create(Role.MODERATOR, Set.of(universityId)));

                var result = mvc.perform(get("/api/pages?hidden_eq=false").contentType(MediaType.APPLICATION_JSON))
                        .andExpect(status().isOk())
                        .andReturn();

                var items = objectMapper.readValue(result.getResponse().getContentAsString(), new TypeReference<List<PageDtoDetailed>>() {
                });

                assertThat(items, everyItem(hasProperty("university", hasProperty("id", is(universityId)))));
                assertThat(items, everyItem(hasProperty("hidden", is(false))));
            }

            @Test
            void getAll_ModeratorRole_WithoutUniversityAccess_Success_EmptyList() throws Exception {
                ctx.setAuthentication(CustomAuthenticationToken.create(Role.MODERATOR, Set.of()));

                var result = mvc.perform(get("/api/pages").contentType(MediaType.APPLICATION_JSON))
                        .andExpect(status().isOk())
                        .andReturn();

                var items = objectMapper.readValue(result.getResponse().getContentAsString(), new TypeReference<List<PageDtoDetailed>>() {
                });

                assertThat(items, is(empty()));
            }
        }

        @Nested
        class GetPagesUserRoleTestClass {
            @Test
            void getAll_UserRole_WithUniversityAccess_Success_OnlyForAssignedUniversity() throws Exception {
                ctx.setAuthentication(CustomAuthenticationToken.create(Role.USER, Set.of(universityId)));

                var result = mvc.perform(get("/api/pages").contentType(MediaType.APPLICATION_JSON))
                        .andExpect(status().isOk())
                        .andReturn();

                var items = objectMapper.readValue(result.getResponse().getContentAsString(), new TypeReference<List<PageDtoDetailed>>() {
                });

                assertThat(items, everyItem(hasProperty("university", hasProperty("id", is(universityId)))));
            }

            @Test
            void getAll_UserRole_WithUniversityAccess_FilterOnlyVisible_Success() throws Exception {
                ctx.setAuthentication(CustomAuthenticationToken.create(Role.USER, Set.of(universityId)));

                var result = mvc.perform(get("/api/pages?hidden_eq=false").contentType(MediaType.APPLICATION_JSON))
                        .andExpect(status().isOk())
                        .andReturn();

                var items = objectMapper.readValue(result.getResponse().getContentAsString(), new TypeReference<List<PageDtoDetailed>>() {
                });

                assertThat(items, everyItem(hasProperty("university", hasProperty("id", is(universityId)))));
                assertThat(items, everyItem(hasProperty("hidden", is(false))));
            }

            @Test
            void getAll_UserRole_WithoutUniversityAccess_Success_EmptyList() throws Exception {
                ctx.setAuthentication(CustomAuthenticationToken.create(Role.USER, Set.of()));

                var result = mvc.perform(get("/api/pages").contentType(MediaType.APPLICATION_JSON))
                        .andExpect(status().isOk())
                        .andReturn();

                var items = objectMapper.readValue(result.getResponse().getContentAsString(), new TypeReference<List<PageDtoDetailed>>() {
                });

                assertThat(items, is(empty()));
            }
        }
    }
}
