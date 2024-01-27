package put.eunice.cms.template;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
import org.springframework.transaction.annotation.Transactional;
import put.eunice.cms.BaseAPIControllerTest;
import put.eunice.cms.security.Role;
import put.eunice.cms.template.projections.TemplateDtoDetailed;
import put.eunice.cms.template.projections.TemplateDtoFormCreate;
import put.eunice.cms.template.projections.TemplateDtoFormUpdate;
import put.eunice.cms.template.projections.TemplateDtoSimple;
import put.eunice.cms.university.University;
import put.eunice.cms.university.UniversityRepository;
import put.eunice.cms.user.User;

public class TemplateControllerTest extends BaseAPIControllerTest {
    @Autowired private UniversityRepository universityRepository;
    @Autowired private TemplateRepository templateRepository;

    private Long userId = 99L;
    private Long universityId = 99L;
    private Long templateId = 99L;
    private Long allUniTemplateId = 99L;

    @Override
    protected String getUrl() {
        return "/api/templates";
    }

    @Override
    @Transactional
    protected void setupData() {
        var user = new User("TEST_USER", Role.USER, true);
        user = userRepository.save(user);
        this.userId = user.getId();

        var university = new University("TEST_UNIVERSITY", "TST_U", false);
        university = universityRepository.save(university);
        this.universityId = university.getId();

        university.enrollUsers(user);
        university = universityRepository.save(university);
        this.universityId = university.getId();

        var template =
                templateRepository.save(
                        new Template("TEST_TEMPLATE" + Instant.now().toString(), "TEST_TEMPLATE_CONTENT"));
        template.attachUniversity(university);
        template = templateRepository.save(template);
        this.templateId = template.getId();

        template =
                templateRepository.save(
                        new Template(
                                "TEST_TEMPLATE" + Instant.now().toString(), "TEST_TEMPLATE_CONTENT", true));

        this.allUniTemplateId = template.getId();
    }

    @AfterEach
    public void cleanup() {
        if (userRepository.existsById(userId)) userRepository.deleteById(userId);

        if (universityRepository.existsById(universityId)) {
            universityRepository.deleteById(universityId);
        }
    }

    @Nested
    class CreateTemplateTestClass {
        @Nested
        class CreateUniversityTemplateTestClass {
            private TemplateDtoFormCreate dto;

            @BeforeEach
            public void setup() {
                dto =
                        new TemplateDtoFormCreate(
                                "TEST_TEMPLATE" + Instant.now().toString(),
                                "TEST_TEMPLATE_DESCRIPTION",
                                Set.of(universityId),
                                false);
            }

            @Test
            void create_GuestUser_Unauthorized() throws Exception {
                performAsGuest();
                performPost(dto).andExpect(status().isUnauthorized());
            }

            @Test
            void create_User_BadRequest() throws Exception {
                performAs(Role.USER);
                performPost(dto).andExpect(status().isBadRequest());
            }

            @Test
            void create_UniversityUser_Success() throws Exception {
                performAs(Role.USER, Set.of(universityId), userId);
                var value =
                        getValue(
                                performPost(dto).andExpect(status().is2xxSuccessful()), TemplateDtoDetailed.class);
                assertThat(value, hasProperty("availableToAllUniversities", is(false)));
            }

            @Test
            void create_UniversityAdministrator_Success() throws Exception {
                performAs(Role.MODERATOR, Set.of(universityId), userId);
                var value =
                        getValue(
                                performPost(dto).andExpect(status().is2xxSuccessful()), TemplateDtoDetailed.class);
                assertThat(value, hasProperty("availableToAllUniversities", is(false)));
            }

            @Test
            void create_Administrator_Success() throws Exception {
                performAs(Role.ADMIN);
                var value =
                        getValue(
                                performPost(dto).andExpect(status().is2xxSuccessful()), TemplateDtoDetailed.class);
                assertThat(value, hasProperty("availableToAllUniversities", is(false)));
            }
        }

        @Nested
        class CreateOtherThanUserUniversityTemplateTestClass {
            private TemplateDtoFormCreate dto;

            @BeforeEach
            public void setup() {
                dto =
                        new TemplateDtoFormCreate(
                                "TEST_TEMPLATE" + Instant.now().toString(),
                                "TEST_TEMPLATE_DESCRIPTION",
                                Set.of(1L),
                                false);
            }

            @Test
            void create_User_BadRequest() throws Exception {
                performAs(Role.USER);
                performPost(dto).andExpect(status().isBadRequest());
            }

            @Test
            void create_UniversityUser_BadRequest() throws Exception {
                performAs(Role.USER, Set.of(universityId), userId);
                performPost(dto).andExpect(status().isBadRequest());
            }

            @Test
            void create_UniversityAdministrator_Success() throws Exception {
                performAs(Role.MODERATOR, Set.of(universityId), userId);
                performPost(dto).andExpect(status().isBadRequest());
            }

            @Test
            void create_Administrator_Success() throws Exception {
                performAs(Role.ADMIN);
                var value =
                        getValue(
                                performPost(dto).andExpect(status().is2xxSuccessful()), TemplateDtoDetailed.class);
                assertThat(value, hasProperty("availableToAllUniversities", is(false)));
            }
        }

        @Nested
        class CreateAvailableToAllUniversitiesTemplateTestClass {
            private TemplateDtoFormCreate dto;

            @BeforeEach
            public void setup() {
                dto =
                        new TemplateDtoFormCreate(
                                "TEST_TEMPLATE" + Instant.now().toString(),
                                "TEST_TEMPLATE_DESCRIPTION",
                                Set.of(),
                                true);
            }

            @Test
            void create_GuestUser_Unauthorized() throws Exception {
                performAsGuest();
                performPost(dto).andExpect(status().isUnauthorized());
            }

            @Test
            void create_User_BadRequest() throws Exception {
                performAs(Role.USER);
                performPost(dto).andExpect(status().isBadRequest());
            }

            @Test
            void create_UniversityUser_BadRequest() throws Exception {
                performAs(Role.USER, Set.of(universityId), userId);
                performPost(dto).andExpect(status().isBadRequest());
            }

            @Test
            void create_UniversityAdministrator_BadRequest() throws Exception {
                performAs(Role.MODERATOR, Set.of(universityId), userId);
                performPost(dto).andExpect(status().isBadRequest());
            }

            @Test
            void create_Administrator_Success() throws Exception {
                performAs(Role.ADMIN);
                var value =
                        getValue(
                                performPost(dto).andExpect(status().is2xxSuccessful()), TemplateDtoDetailed.class);
                assertThat(value, hasProperty("availableToAllUniversities", is(true)));
            }
        }
    }

    @Nested
    class UpdateTemplateTestClass {
        @Nested
        class UpdateUserUniversityTemplateTestClass {
            private TemplateDtoFormUpdate dto;

            @BeforeEach
            public void setup() {
                dto =
                        new TemplateDtoFormUpdate(
                                "UPDATED_TEST_TEMPLATE",
                                "UPDATED_TEST_TEMPLATE_CONTENT",
                                Set.of(universityId),
                                false);
            }

            @Test
            void update_GuestUser_Unauthorized() throws Exception {
                performAsGuest();
                performPut(templateId, dto).andExpect(status().isUnauthorized());
            }

            @Test
            void update_UniversityUser_Success() throws Exception {
                performAs(Role.USER, Set.of(universityId), userId);
                var value =
                        getValue(
                                performPut(templateId, dto).andExpect(status().is2xxSuccessful()),
                                TemplateDtoDetailed.class);
                assertThat(value, hasProperty("availableToAllUniversities", is(false)));
            }

            @Test
            void update_UniversityAdministrator_Success() throws Exception {
                performAs(Role.MODERATOR, Set.of(universityId), userId);
                var value =
                        getValue(
                                performPut(templateId, dto).andExpect(status().is2xxSuccessful()),
                                TemplateDtoDetailed.class);
                assertThat(value, hasProperty("availableToAllUniversities", is(false)));
            }

            @Test
            void update_Administrator_Success() throws Exception {
                performAs(Role.ADMIN);
                var value =
                        getValue(
                                performPut(templateId, dto).andExpect(status().is2xxSuccessful()),
                                TemplateDtoDetailed.class);
                assertThat(value, hasProperty("availableToAllUniversities", is(false)));
            }
        }

        @Nested
        class UpdateOtherThanUserUniversityTemplateTestClass {
            private TemplateDtoFormUpdate dto;

            @BeforeEach
            public void setup() {
                dto =
                        new TemplateDtoFormUpdate(
                                "UPDATED_TEST_TEMPLATE", "UPDATED_TEST_TEMPLATE_CONTENT", Set.of(1L), false);
            }

            @Test
            void update_GuestUser_Unauthorized() throws Exception {
                performAsGuest();
                performPut(templateId, dto).andExpect(status().isUnauthorized());
            }

            @Test
            void update_UniversityUser_BadRequest() throws Exception {
                performAs(Role.USER, Set.of(universityId), userId);
                performPut(templateId, dto).andExpect(status().isBadRequest());
            }

            @Test
            void update_UniversityAdministrator_BadRequest() throws Exception {
                performAs(Role.MODERATOR, Set.of(universityId), userId);
                performPut(templateId, dto).andExpect(status().isBadRequest());
            }

            @Test
            void update_Administrator_Success() throws Exception {
                performAs(Role.ADMIN);
                var value =
                        getValue(
                                performPut(templateId, dto).andExpect(status().is2xxSuccessful()),
                                TemplateDtoDetailed.class);
                assertThat(value, hasProperty("availableToAllUniversities", is(false)));
            }
        }

        @Nested
        class UpdateMarkAsAvailableToAllTemplateTestClass {
            private TemplateDtoFormUpdate dto;

            @BeforeEach
            public void setup() {
                dto =
                        new TemplateDtoFormUpdate(
                                "UPDATED_TEST_TEMPLATE", "UPDATED_TEST_TEMPLATE_CONTENT", Set.of(), true);
            }

            @Test
            void update_GuestUser_Unauthorized() throws Exception {
                performAsGuest();
                performPut(templateId, dto).andExpect(status().isUnauthorized());
            }

            @Test
            void update_UniversityUser_BadRequest() throws Exception {
                performAs(Role.USER, Set.of(universityId), userId);
                performPut(templateId, dto).andExpect(status().isBadRequest());
            }

            @Test
            void update_UniversityAdministrator_BadRequest() throws Exception {
                performAs(Role.MODERATOR, Set.of(universityId), userId);
                performPut(templateId, dto).andExpect(status().isBadRequest());
            }

            @Test
            void update_UniversityUserOfOtherUniversity_BadRequest() throws Exception {
                performAs(Role.USER, Set.of(1L));
                performPut(templateId, dto).andExpect(status().isBadRequest());
            }

            @Test
            void update_UniversityAdministratorOfDifferentUniversity_BadRequest() throws Exception {
                performAs(Role.MODERATOR, Set.of(1L));
                performPut(templateId, dto).andExpect(status().isBadRequest());
            }

            @Test
            void update_Administrator_Success() throws Exception {
                performAs(Role.ADMIN);
                var value =
                        getValue(
                                performPut(templateId, dto).andExpect(status().is2xxSuccessful()),
                                TemplateDtoDetailed.class);
                assertThat(value, hasProperty("availableToAllUniversities", is(true)));
            }
        }

        @Nested
        class UpdateAvailableToAllTemplateTestClass {
            private TemplateDtoFormUpdate dto;

            @BeforeEach
            public void setup() {
                dto =
                        new TemplateDtoFormUpdate(
                                "UPDATED_TEST_TEMPLATE", "UPDATED_TEST_TEMPLATE_CONTENT", Set.of(), true);
            }

            @Test
            void update_GuestUser_Unauthorized() throws Exception {
                performAsGuest();
                performPut(allUniTemplateId, dto).andExpect(status().isUnauthorized());
            }

            @Test
            void update_UniversityUser_BadRequest() throws Exception {
                performAs(Role.USER, Set.of(universityId), userId);
                performPut(allUniTemplateId, dto).andExpect(status().isBadRequest());
            }

            @Test
            void update_UniversityAdministrator_BadRequest() throws Exception {
                performAs(Role.MODERATOR, Set.of(universityId), userId);
                performPut(allUniTemplateId, dto).andExpect(status().isBadRequest());
            }

            @Test
            void update_Administrator_Success() throws Exception {
                performAs(Role.ADMIN);
                var value =
                        getValue(
                                performPut(allUniTemplateId, dto).andExpect(status().is2xxSuccessful()),
                                TemplateDtoDetailed.class);
                assertThat(value, hasProperty("availableToAllUniversities", is(true)));
            }
        }
    }

    @Nested
    class GetTemplateTestClass {

        @Nested
        class UserUniversityTemplateTestClass {

            @Test
            void get_template_GuestUser_Unauthorized() throws Exception {
                performAsGuest();
                performGet(templateId).andExpect(status().isUnauthorized());
            }

            @Test
            void get_template_UniversityUser_Success() throws Exception {
                performAs(Role.USER, Set.of(universityId));
                performGet(templateId).andExpect(status().isOk());
            }

            @Test
            void get_template_UniversityUserOfOtherUniversity_NotFound() throws Exception {
                performAs(Role.USER, Set.of(0L));
                performGet(templateId).andExpect(status().isNotFound());
            }

            @Test
            void get_template_UniversityAdministrator_Success() throws Exception {
                performAs(Role.MODERATOR, Set.of(universityId));
                performGet(templateId).andExpect(status().isOk());
            }

            @Test
            void get_template_UniversityAdministratorOfOtherUniversity_NotFound() throws Exception {
                performAs(Role.MODERATOR, Set.of(0L), userId);
                performGet(templateId).andExpect(status().isNotFound());
            }

            @Test
            void get_template_Administrator_Success() throws Exception {
                performAs(Role.ADMIN);
                performGet(templateId).andExpect(status().isOk());
            }
        }

        @Nested
        class AllUniversitiesTemplateTestClass {
            @Test
            void get_allUniversitiesTemplate_GuestUser_Unauthorized() throws Exception {
                performAsGuest();
                performGet(allUniTemplateId).andExpect(status().isUnauthorized());
            }

            @Test
            void get_allUniversitiesTemplate_UniversityUser_Success() throws Exception {
                performAs(Role.USER, Set.of(universityId));
                performGet(allUniTemplateId).andExpect(status().isOk());
            }

            @Test
            void get_allUniversitiesTemplate_UniversityUserOfOtherUniversity_Success() throws Exception {
                performAs(Role.USER, Set.of(0L));
                performGet(allUniTemplateId).andExpect(status().isOk());
            }

            @Test
            void get_allUniversitiesTemplate_UniversityAdministrator_Success() throws Exception {
                performAs(Role.MODERATOR, Set.of(universityId), userId);
                performGet(allUniTemplateId).andExpect(status().isOk());
            }

            @Test
            void get_allUniversitiesTemplate_UniversityAdministratorOfOtherUniversity_Success()
                    throws Exception {
                performAs(Role.MODERATOR, Set.of(0L), userId);
                performGet(allUniTemplateId).andExpect(status().isOk());
            }

            @Test
            void get_allUniversitiesTemplate_Administrator_Success() throws Exception {
                performAs(Role.ADMIN);
                performGet(allUniTemplateId).andExpect(status().isOk());
            }
        }
    }

    @Nested
    class DeleteTemplateTestClass {

        @Nested
        class DeleteUniversityTemplateTestClass {
            @Test
            void delete_template_GuestUser_Unauthorized() throws Exception {
                performAsGuest();
                performDelete(templateId).andExpect(status().isUnauthorized());
            }

            @Test
            void delete_template_UniversityUser_Success() throws Exception {
                performAs(Role.USER, Set.of(universityId));
                performDelete(templateId).andExpect(status().is2xxSuccessful());
            }

            @Test
            void delete_template_UniversityAdministrator_Success() throws Exception {
                performAs(Role.MODERATOR, Set.of(universityId));
                performDelete(templateId).andExpect(status().is2xxSuccessful());
            }

            @Test
            void delete_template_Administrator_Success() throws Exception {
                performAs(Role.ADMIN);
                performDelete(templateId).andExpect(status().is2xxSuccessful());
            }
        }

        @Nested
        class DeleteAvailableToAllUniversitiesTemplateTestClass {
            @Test
            void delete_template_GuestUser_Unauthorized() throws Exception {
                performAsGuest();
                performDelete(allUniTemplateId).andExpect(status().isUnauthorized());
            }

            @Test
            void delete_template_UniversityUser_Forbidden() throws Exception {
                performAs(Role.USER, Set.of(universityId), userId);
                performDelete(allUniTemplateId).andExpect(status().isForbidden());
            }

            @Test
            void delete_template_UniversityAdministrator_Forbidden() throws Exception {
                performAs(Role.MODERATOR, Set.of(universityId), userId);
                performDelete(allUniTemplateId).andExpect(status().isForbidden());
            }

            @Test
            void delete_template_Administrator_Success() throws Exception {
                performAs(Role.ADMIN);
                performDelete(allUniTemplateId).andExpect(status().is2xxSuccessful());
            }
        }

        @Nested
        class DeleteOtherUniversityThanUserTemplateTestClass {

            @BeforeEach
            @Transactional
            public void setup() {
                var template = templateRepository.findById(templateId).orElseThrow();

                template.setUniversities(Set.of());
                templateRepository.save(template);
            }

            @Test
            void delete_template_GuestUser_Unauthorized() throws Exception {
                performAsGuest();
                performDelete(templateId).andExpect(status().isUnauthorized());
            }

            @Test
            void delete_template_UniversityUser_Forbidden() throws Exception {
                performAs(Role.USER, Set.of(1L));
                performDelete(templateId).andExpect(status().isForbidden());
            }

            @Test
            void delete_template_UniversityUserOfNoneUniversity_Forbidden() throws Exception {
                performAs(Role.USER);
                performDelete(templateId).andExpect(status().isForbidden());
            }

            @Test
            void delete_template_UniversityAdministrator_Forbidden() throws Exception {
                performAs(Role.MODERATOR, Set.of(1L));
                performDelete(templateId).andExpect(status().isForbidden());
            }

            @Test
            void delete_template_UniversityAdministratorOfNoneUniversity_Forbidden() throws Exception {
                performAs(Role.MODERATOR, Set.of());
                performDelete(templateId).andExpect(status().isForbidden());
            }

            @Test
            void delete_template_Administrator_Success() throws Exception {
                performAs(Role.ADMIN);
                performDelete(templateId).andExpect(status().is2xxSuccessful());
            }
        }
    }

    @Nested
    class GetAllTemplatesTestClass {
        @Test
        void get_allTemplates_GuestUser_Unauthorized() throws Exception {
            performAsGuest();
            performGet().andExpect(status().isUnauthorized());
        }

        @Test
        @Transactional
        void get_allTemplates_UniversityUser_Success_OnlyHisUniversityOrAvailableToAll()
                throws Exception {
            performAs(Role.USER, Set.of(universityId), userId);
            var items =
                    getValue(
                            performGet().andExpect(status().isOk()),
                            new TypeReference<List<TemplateDtoSimple>>() {});

            var itemsFromDb =
                    templateRepository.findAllById_withUniversities(
                            items.stream().map(TemplateDtoSimple::getId).collect(Collectors.toList()));

            assertThat(
                    itemsFromDb,
                    everyItem(
                            either(hasProperty("availableToAll", is(true)))
                                    .or(hasProperty("universities", hasItem(hasProperty("id", is(universityId)))))));
        }

        @Test
        void get_allTemplates_UniversityAdministrator_Success_OnlyHisUniversityOrAvailableToAll()
                throws Exception {
            performAs(Role.MODERATOR, Set.of(universityId), userId);
            var items =
                    getValue(
                            performGet().andExpect(status().isOk()),
                            new TypeReference<List<TemplateDtoSimple>>() {});

            var itemsFromDb =
                    templateRepository.findAllById_withUniversities(
                            items.stream().map(TemplateDtoSimple::getId).collect(Collectors.toList()));

            assertThat(
                    itemsFromDb,
                    everyItem(
                            either(hasProperty("availableToAll", is(true)))
                                    .or(hasProperty("universities", hasItem(hasProperty("id", is(universityId)))))));
        }

        @Test
        @Transactional
        void get_allTemplates_Administrator_Success() throws Exception {
            performAs(Role.ADMIN);
            var items =
                    getValue(
                            performGet().andExpect(status().isOk()),
                            new TypeReference<List<TemplateDtoSimple>>() {});

            var itemsFromDb =
                    templateRepository.findAllById_withUniversities(
                            items.stream().map(TemplateDtoSimple::getId).collect(Collectors.toList()));

            assertThat(
                    itemsFromDb,
                    everyItem(
                            either(hasProperty("availableToAll", is(true)))
                                    .or(hasProperty("universities", not(emptyArray())))));
        }
    }

    @Nested
    class GetAllTemplatesWithFilterTestClass {
        @Test
        void get_allTemplatesWithFilter_GuestUser_Unauthorized() throws Exception {
            performAsGuest();
            performGet("?name_ct=TEMPL").andExpect(status().isUnauthorized());
        }

        @Test
        @Transactional
        void get_allTemplatesWithFilter_UniversityUser_Success_OnlyHisUniversityOrAvailableToAll()
                throws Exception {
            performAs(Role.USER, Set.of(universityId), userId);
            var items =
                    getValue(
                            performGet("?name_ct=TEMPL").andExpect(status().isOk()),
                            new TypeReference<List<TemplateDtoSimple>>() {});

            var itemsFromDb =
                    templateRepository.findAllById(
                            items.stream().map(TemplateDtoSimple::getId).collect(Collectors.toList()));

            assertThat(
                    itemsFromDb,
                    everyItem(
                            either(hasProperty("availableToAll", is(true)))
                                    .or(hasProperty("universities", hasItem(hasProperty("id", is(universityId)))))));

            assertThat(itemsFromDb, everyItem(hasProperty("name", containsStringIgnoringCase("TEMPL"))));
        }

        @Test
        @Transactional
        void
                get_allTemplatesWithFilter_UniversityAdministrator_Success_OnlyHisUniversityOrAvailableToAll()
                        throws Exception {
            performAs(Role.MODERATOR, Set.of(universityId), userId);
            var items =
                    getValue(
                            performGet("?name_ct=TEMPL").andExpect(status().isOk()),
                            new TypeReference<List<TemplateDtoSimple>>() {});

            var itemsFromDb =
                    templateRepository.findAllById(
                            items.stream().map(TemplateDtoSimple::getId).collect(Collectors.toList()));

            assertThat(
                    itemsFromDb,
                    everyItem(
                            either(hasProperty("availableToAll", is(true)))
                                    .or(hasProperty("universities", hasItem(hasProperty("id", is(universityId)))))));

            assertThat(itemsFromDb, everyItem(hasProperty("name", containsStringIgnoringCase("TEMPL"))));
        }

        @Test
        @Transactional
        void get_allTemplatesWithFilter_Administrator_Success() throws Exception {
            performAs(Role.ADMIN);
            var items =
                    getValue(
                            performGet("?name_ct=TEMPL").andExpect(status().isOk()),
                            new TypeReference<List<TemplateDtoSimple>>() {});

            var itemsFromDb =
                    templateRepository.findAllById(
                            items.stream().map(TemplateDtoSimple::getId).collect(Collectors.toList()));

            assertThat(itemsFromDb, everyItem(hasProperty("name", containsStringIgnoringCase("TEMPL"))));
        }
    }
}
