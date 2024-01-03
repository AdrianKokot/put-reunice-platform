package com.example.cms.university;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.cms.BaseAPIControllerTest;
import com.example.cms.security.Role;
import com.example.cms.university.projections.UniversityDtoDetailed;
import com.example.cms.university.projections.UniversityDtoFormCreate;
import com.example.cms.university.projections.UniversityDtoFormUpdate;
import com.example.cms.university.projections.UniversityDtoSimple;
import com.example.cms.user.User;
import com.fasterxml.jackson.core.type.TypeReference;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class UniversityControllerTest extends BaseAPIControllerTest {
    @Autowired private UniversityRepository universityRepository;

    private Long userId = 99L;
    private Long universityId = 99L;

    @Override
    protected String getUrl() {
        return "/api/universities";
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
    class CreateUniversityTestClass {
        private UniversityDtoFormCreate dto;

        @BeforeEach
        public void setup() {
            dto =
                    new UniversityDtoFormCreate(
                            "TEST_UNIVERSITY" + Instant.now().toEpochMilli(),
                            "TU" + Instant.now().toEpochMilli(),
                            "TEST_UNIVERSITY_DESCRIPTION",
                            userId,
                            "TEST_UNIVERSITY_ADDRESS",
                            "TEST_UNIVERSITY_WEBSITE");
        }

        @Test
        void create_GuestUser_Unauthorized() throws Exception {
            performAsGuest();
            performPost(dto).andExpect(status().isUnauthorized());
        }

        @Test
        void create_UniversityUser_Forbidden() throws Exception {
            performAs(Role.USER, userId);
            performPost(dto).andExpect(status().isForbidden());
        }

        @Test
        void create_UniversityAdministrator_Forbidden() throws Exception {
            performAs(Role.MODERATOR, userId);
            performPost(dto).andExpect(status().isForbidden());
        }

        @Test
        void create_Administrator_Success() throws Exception {
            performAs(Role.ADMIN, userId);

            var createdUniversityDto =
                    getValue(
                            performPost(dto).andExpect(status().is2xxSuccessful()), UniversityDtoDetailed.class);

            try {
                performDelete(createdUniversityDto.getId()).andExpect(status().is2xxSuccessful());
            } catch (Exception ignored) {
            }
        }
    }

    @Nested
    class UpdateUniversityTestClass {
        private UniversityDtoFormUpdate dto;

        @BeforeEach
        public void setup() {
            dto =
                    new UniversityDtoFormUpdate(
                            "TEST_UNIVERSITY" + Instant.now().toString(),
                            "TU" + Instant.now().toString(),
                            "TEST_UNIVERSITY_DESCRIPTION",
                            "TEST_UNIVERSITY_ADDRESS",
                            "TEST_UNIVERSITY_WEBSITE",
                            false);
        }

        @Test
        void update_GuestUser_Unauthorized() throws Exception {
            performAsGuest();
            performPut(universityId, dto).andExpect(status().isUnauthorized());
        }

        @Test
        void update_UniversityUser_Forbidden() throws Exception {
            performAs(Role.USER, userId);
            performPut(universityId, dto).andExpect(status().isForbidden());
        }

        @Test
        void update_UniversityAdministrator_Success() throws Exception {
            performAs(Role.MODERATOR, Set.of(universityId), userId);
            performPut(universityId, dto).andExpect(status().is2xxSuccessful());
        }

        @Test
        void update_UniversityAdministratorOfDifferentUniversity_Forbidden() throws Exception {
            performAs(Role.MODERATOR, Set.of(-1L), userId);
            performPut(universityId, dto).andExpect(status().isForbidden());
        }

        @Test
        void update_Administrator_Success() throws Exception {
            performAs(Role.ADMIN);
            performPut(universityId, dto).andExpect(status().is2xxSuccessful());
        }
    }

    @Nested
    class DeleteUniversityTestClass {
        @Test
        void delete_GuestUser_Unauthorized() throws Exception {
            performAsGuest();
            performDelete(universityId).andExpect(status().isUnauthorized());
        }

        @Test
        void delete_UniversityUser_Forbidden() throws Exception {
            performAs(Role.USER, Set.of(universityId));
            performDelete(universityId).andExpect(status().isForbidden());
        }

        @Test
        void delete_UniversityAdministrator_Forbidden() throws Exception {
            performAs(Role.MODERATOR, Set.of(universityId), userId);
            performDelete(universityId).andExpect(status().isForbidden());
        }

        @Test
        void delete_Administrator_BadRequest() throws Exception {
            performAs(Role.ADMIN);
            performDelete(universityId).andExpect(status().isBadRequest());
        }

        @Test
        void delete_HideUniversityAndDelete_Administrator_Success() throws Exception {
            performAs(Role.ADMIN);

            var universityDto =
                    getValue(
                            performGet(universityId).andExpect(status().isOk()), UniversityDtoDetailed.class);

            performPut(
                            universityId,
                            new UniversityDtoFormUpdate(
                                    universityDto.getName(),
                                    universityDto.getShortName(),
                                    universityDto.getDescription(),
                                    universityDto.getAddress(),
                                    universityDto.getWebsite(),
                                    true))
                    .andExpect(status().is2xxSuccessful());

            performDelete(universityId).andExpect(status().is2xxSuccessful());
        }
    }

    @Nested
    class GetUniversityTestClass {

        @Nested
        class VisibleUniversityTestClass {
            @BeforeEach
            void setupData() {
                var university = universityRepository.findById(universityId).get();
                university.setHidden(false);
                universityRepository.save(university);
            }

            @Test
            void get_visibleUniversity_GuestUser_Success() throws Exception {
                performAsGuest();
                performGet(universityId).andExpect(status().isOk());
            }

            @Test
            void get_visibleUniversity_UniversityUser_Success() throws Exception {
                performAs(Role.USER, Set.of(universityId));
                performGet(universityId).andExpect(status().isOk());
            }

            @Test
            void get_visibleUniversity_UniversityUserOfOtherUniversity_Success() throws Exception {
                performAs(Role.USER, Set.of(0L));
                performGet(universityId).andExpect(status().isOk());
            }

            @Test
            void get_visibleUniversity_UniversityAdministrator_Success() throws Exception {
                performAs(Role.MODERATOR, Set.of(universityId), userId);
                performGet(universityId).andExpect(status().isOk());
            }

            @Test
            void get_visibleUniversity_UniversityAdministratorOfOtherUniversity_Success()
                    throws Exception {
                performAs(Role.MODERATOR, Set.of(0L), userId);
                performGet(universityId).andExpect(status().isOk());
            }

            @Test
            void get_visibleUniversity_Administrator_Success() throws Exception {
                performAs(Role.ADMIN);
                performGet(universityId).andExpect(status().isOk());
            }
        }

        @Nested
        class HiddenUniversityTestClass {
            @BeforeEach
            void setupData() {
                var university = universityRepository.findById(universityId).get();
                university.setHidden(true);
                universityRepository.save(university);
            }

            @Test
            void get_hiddenUniversity_GuestUser_NotFound() throws Exception {
                performAsGuest();
                performGet(universityId).andExpect(status().isNotFound());
            }

            @Test
            void get_hiddenUniversity_UniversityUser_Success() throws Exception {
                performAs(Role.USER, Set.of(universityId));
                performGet(universityId).andExpect(status().isOk());
            }

            @Test
            void get_hiddenUniversity_UniversityUserOfOtherUniversity_NotFound() throws Exception {
                performAs(Role.USER, Set.of(0L));
                performGet(universityId).andExpect(status().isNotFound());
            }

            @Test
            void get_hiddenUniversity_UniversityAdministrator_Success() throws Exception {
                performAs(Role.MODERATOR, Set.of(universityId), userId);
                performGet(universityId).andExpect(status().isOk());
            }

            @Test
            void get_hiddenUniversity_UniversityAdministratorOfOtherUniversity_NotFound()
                    throws Exception {
                performAs(Role.MODERATOR, Set.of(0L), userId);
                performGet(universityId).andExpect(status().isNotFound());
            }

            @Test
            void get_hiddenUniversity_Administrator_Success() throws Exception {
                performAs(Role.ADMIN);
                performGet(universityId).andExpect(status().isOk());
            }
        }
    }

    @Nested
    class GetAllUniversitiesTestClass {

        @Test
        void get_allUniversities_GuestUser_SuccessOnlyVisible() throws Exception {
            performAsGuest();
            var items =
                    getValue(
                            performGet().andExpect(status().isOk()),
                            new TypeReference<List<UniversityDtoSimple>>() {});

            assertThat(items, everyItem(hasProperty("hidden", is(false))));
        }

        @Test
        void get_allUniversities_UniversityUser_SuccessOnlyVisibleAndMyUniversity() throws Exception {
            performAs(Role.USER, Set.of(universityId));
            var items =
                    getValue(
                            performGet().andExpect(status().isOk()),
                            new TypeReference<List<UniversityDtoSimple>>() {});

            assertThat(
                    items,
                    everyItem(
                            either(hasProperty("hidden", is(false))).or(hasProperty("id", is(universityId)))));
        }

        @Test
        void get_allUniversities_UniversityUserOfOtherUniversity_SuccessOnlyVisible() throws Exception {
            performAs(Role.USER, Set.of(0L));
            var items =
                    getValue(
                            performGet().andExpect(status().isOk()),
                            new TypeReference<List<UniversityDtoSimple>>() {});

            assertThat(items, everyItem(hasProperty("hidden", is(false))));
        }

        @Test
        void get_allUniversities_UniversityAdministrator_SuccessOnlyVisibleAndMyUniversity()
                throws Exception {
            performAs(Role.MODERATOR, Set.of(universityId), userId);
            var items =
                    getValue(
                            performGet().andExpect(status().isOk()),
                            new TypeReference<List<UniversityDtoSimple>>() {});

            assertThat(
                    items,
                    everyItem(
                            either(hasProperty("hidden", is(false))).or(hasProperty("id", is(universityId)))));
        }

        @Test
        void get_allUniversities_UniversityAdministratorOfOtherUniversity_SuccessOnlyVisible()
                throws Exception {
            performAs(Role.MODERATOR, Set.of(0L), userId);
            var items =
                    getValue(
                            performGet().andExpect(status().isOk()),
                            new TypeReference<List<UniversityDtoSimple>>() {});

            assertThat(items, everyItem(hasProperty("hidden", is(false))));
        }

        @Test
        void get_allUniversities_Administrator_Success() throws Exception {
            performAs(Role.ADMIN);
            var items =
                    getValue(
                            performGet().andExpect(status().isOk()),
                            new TypeReference<List<UniversityDtoSimple>>() {});

            assertThat(
                    items,
                    everyItem(either(hasProperty("hidden", is(false))).or(hasProperty("hidden", is(true)))));
        }
    }

    @Nested
    class GetAllUniversitiesWithFiltersTestClass {
        @Test
        void get_HiddenOnly() throws Exception {
            performAs(Role.ADMIN);

            var items =
                    getValue(
                            performGet("?hidden_eq=true").andExpect(status().isOk()),
                            new TypeReference<List<UniversityDtoSimple>>() {});

            assertThat(items.size(), greaterThan(0));
            assertThat(items, everyItem(hasProperty("hidden", is(true))));
        }

        @Test
        void get_VisibleOnly() throws Exception {
            performAs(Role.ADMIN);

            var items =
                    getValue(
                            performGet("?hidden_eq=false").andExpect(status().isOk()),
                            new TypeReference<List<UniversityDtoSimple>>() {});

            assertThat(items.size(), greaterThan(0));
            assertThat(items, everyItem(hasProperty("hidden", is(false))));
        }

        @Test
        void get_ShortNameContainsP() throws Exception {
            performAs(Role.ADMIN);

            var items =
                    getValue(
                            performGet("?shortName_ct=P").andExpect(status().isOk()),
                            new TypeReference<List<UniversityDtoSimple>>() {});

            assertThat(items.size(), greaterThan(0));
            assertThat(items, everyItem(hasProperty("shortName", containsString("P"))));
        }

        @Test
        void get_ShortNameContainsPAndHiddenOnly() throws Exception {
            performAs(Role.ADMIN);

            var items =
                    getValue(
                            performGet("?shortName_ct=P&hidden_eq=true").andExpect(status().isOk()),
                            new TypeReference<List<UniversityDtoSimple>>() {});

            assertThat(items.size(), greaterThan(0));
            assertThat(
                    items,
                    everyItem(
                            allOf(
                                    hasProperty("shortName", containsStringIgnoringCase("P")),
                                    hasProperty("hidden", is(true)))));
        }

        @Test
        void get_NameContainsPAndVisibleOnly() throws Exception {
            performAs(Role.ADMIN);

            var items =
                    getValue(
                            performGet("?name_ct=P&hidden_eq=false").andExpect(status().isOk()),
                            new TypeReference<List<UniversityDtoSimple>>() {});

            assertThat(items.size(), greaterThan(0));
            assertThat(
                    items,
                    everyItem(
                            allOf(
                                    hasProperty("name", containsStringIgnoringCase("p")),
                                    hasProperty("hidden", is(false)))));
        }

        @Test
        void get_IdEquals1() throws Exception {
            performAs(Role.ADMIN);

            var items =
                    getValue(
                            performGet("?id_eq=1").andExpect(status().isOk()),
                            new TypeReference<List<UniversityDtoSimple>>() {});

            assertThat(items.size(), greaterThan(0));
            assertThat(items, everyItem(hasProperty("id", is(1L))));
        }
    }
}
