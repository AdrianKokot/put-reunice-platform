package com.example.cms.development;

import com.example.cms.backup.BackupService;
import com.example.cms.backup.exceptions.BackupException;
import com.example.cms.configuration.ApplicationConfigurationProvider;
import com.example.cms.configuration.DatabaseSchemaCreateType;
import com.example.cms.configuration.DatabaseSchemaHandlingOnStartup;
import com.example.cms.page.PageService;
import com.example.cms.page.projections.PageDtoFormCreate;
import com.example.cms.page.projections.PageDtoFormUpdate;
import com.example.cms.security.Role;
import com.example.cms.template.TemplateService;
import com.example.cms.template.projections.TemplateDtoFormCreate;
import com.example.cms.ticket.TicketService;
import com.example.cms.ticket.projections.TicketDtoFormCreate;
import com.example.cms.university.UniversityService;
import com.example.cms.university.projections.UniversityDtoFormCreate;
import com.example.cms.university.projections.UniversityDtoFormUpdate;
import com.example.cms.user.UserService;
import com.example.cms.user.projections.UserDtoFormCreate;
import java.io.File;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
class DummyDataCreator implements ApplicationListener<ContextRefreshedEvent> {

    private final PageService pageService;
    private final UserService userService;
    private final UniversityService universityService;
    private final TemplateService templateService;
    private final BackupService backupService;
    private final TicketService ticketService;

    @Autowired private AuthenticationManager authenticationManager;

    @Autowired private ApplicationConfigurationProvider applicationConfigurationProvider;

    @Override
    public void onApplicationEvent(@NonNull final ContextRefreshedEvent event) {
        try {
            SecurityContext ctx = SecurityContextHolder.createEmptyContext();
            SecurityContextHolder.setContext(ctx);
            ctx.setAuthentication(CustomAuthenticationToken.create(Role.ADMIN, Set.of()));

            Files.createDirectories(backupService.getRestoreMainPath());
            Files.createDirectories(backupService.getBackupsMainPath());

            // MSz extended
            log.info(
                    String.format(
                            "** databaseSchemaHandlingOnStartup read from properties file: %s",
                            applicationConfigurationProvider.getDatabaseSchemaHandlingOnStartup()));
            if (applicationConfigurationProvider.getDatabaseSchemaHandlingOnStartup()
                    == DatabaseSchemaHandlingOnStartup.CREATE) {
                tryToRestoreDatabase(applicationConfigurationProvider.getDatabaseSchemaCreateType());
            } else {
                log.info("** Using encountered database schema.");
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            SecurityContextHolder.clearContext();
        }
    }

    /**
     * Checks if there is at least one zip file in the path returned by {@link
     * BackupService#getRestoreMainPath()}, and if so, then takes randomly one of available zip files
     * and tries to restore all tables in the database from that backup file. If there is not a zip
     * file in the path returned by {@link BackupService#getRestoreMainPath()}, then inserts data into
     * the database based on the value of the parameter.
     *
     * @param databaseSchemaCreateType type of database schema create to perform on application
     *     startup if a backup is not available
     */
    private void tryToRestoreDatabase(DatabaseSchemaCreateType databaseSchemaCreateType) {
        Arrays.stream(
                        Optional.ofNullable(backupService.getRestoreMainPath().toFile().listFiles())
                                .orElseThrow(BackupException::new))
                .filter(File::isFile)
                .map(File::getName)
                .filter(fileName -> fileName.substring(fileName.lastIndexOf('.')).equals(".zip"))
                .map(fileName -> fileName.substring(0, fileName.lastIndexOf('.')))
                .findAny()
                .ifPresentOrElse(
                        backupName -> {
                            try {
                                backupService.importBackup(backupName);
                            } catch (Exception e) {
                                throw new RuntimeException(e);
                            }
                            log.info(String.format("** Imported %s backup.", backupName));
                        },
                        () -> {
                            switch (databaseSchemaCreateType) {
                                case POPULATE:
                                    createDummyData();
                                    log.info("** Created dummy data.");
                                    break;
                                case INITIALIZE:
                                    createInitialData();
                                    log.info("** Database schema initialized with a main administrator account.");
                                    break;
                            }
                        });
    }

    /**
     * Creates minimum data for the application to be functional, i.e., only the main administrator
     * account.
     */
    private void createInitialData() {
        userService.createUser(
                new UserDtoFormCreate(
                        "admin",
                        "51D7k4F8",
                        "Name",
                        "Surname",
                        "__unique__email@gmail.com",
                        "123456789",
                        true,
                        Role.ADMIN,
                        Set.of()));
    }

    /**
     * Creates some dummy data to be presented in the running application, so it can be tested
     * manually in a browser (users, universities, user enrollments, pages, and a template).
     */
    private void createDummyData() {
        userService.createUser(
                new UserDtoFormCreate(
                        "admin",
                        "51D7k4F8",
                        "Wojciech",
                        "Kowalski",
                        "wojciech.kowalski7342@gmail.com",
                        "935283642",
                        true,
                        Role.ADMIN,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "admin_bar",
                        "c9wahT0t",
                        "Leszek",
                        "Bartkiewicz",
                        "leszek.bartkiewicz5229@gmail.com",
                        "264878345",
                        true,
                        Role.ADMIN,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "admin_ban",
                        "2eqf1kYN",
                        "Bożena",
                        "Banik",
                        "bozena.banik9987@gmail.com",
                        "653916167",
                        true,
                        Role.ADMIN,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "moderator",
                        "5g7X92KL",
                        "Szymon",
                        "Koltun",
                        "szymon.koltun8441@gmail.com",
                        "311222995",
                        true,
                        Role.MODERATOR,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "mod_zlo",
                        "v4wUr5bC",
                        "Roman",
                        "Zlotkowski",
                        "roman.zlotkowski9843@gmail.com",
                        "739393723",
                        true,
                        Role.MODERATOR,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "mod_rad",
                        "ic1ER2ta",
                        "Ferdynand",
                        "Radecki",
                        "ferdynand.radecki1321@gmail.com",
                        "727456789",
                        true,
                        Role.MODERATOR,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "mod_kos",
                        "41rJ6kRM",
                        "Mateusz",
                        "Kostuch",
                        "mateusz.kostuch2531@gmail.com",
                        "672476734",
                        true,
                        Role.MODERATOR,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "mod_szy",
                        "EVKrFt2a",
                        "Błażej",
                        "Szymkowski",
                        "blazej.szymkowski5231@gmail.com",
                        "738350481",
                        true,
                        Role.MODERATOR,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "mod_mie",
                        "mTU4x1qJ",
                        "Marcin",
                        "Mieczkowski",
                        "marcin.mieczkowski7235@gmail.com",
                        "830393622",
                        true,
                        Role.MODERATOR,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "mod_jus",
                        "Md9pno1v",
                        "Ewa",
                        "Jusko",
                        "ewa.jusko9033@gmail.com",
                        "258683257",
                        true,
                        Role.MODERATOR,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "mod_hal",
                        "BDxm3IDG",
                        "Eliza",
                        "Halicka",
                        "eliza.halicka8511@gmail.com",
                        "852660762",
                        true,
                        Role.MODERATOR,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "mod_ols",
                        "2GuXiZCN",
                        "Igor",
                        "Olszowy",
                        "igor.olszowy5729@gmail.com",
                        "542395438",
                        true,
                        Role.MODERATOR,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "mod_gor",
                        "bnjIi1rp",
                        "Tomasz",
                        "Gorczyca",
                        "tomasz.gorczyca2514@gmail.com",
                        "481764007",
                        true,
                        Role.MODERATOR,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "mod_sob",
                        "S0FHytEq",
                        "Anastazja",
                        "Sobolewicz",
                        "anastazja.sobolewicz7829@gmail.com",
                        "343862564",
                        true,
                        Role.MODERATOR,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "mod_smi",
                        "VIWG10Ss",
                        "Arkadiusz",
                        "Śmiałek",
                        "arkadiusz.smialek2512@gmail.com",
                        "722351974",
                        true,
                        Role.MODERATOR,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "mod_kam",
                        "H7JmHV9H",
                        "Halina",
                        "Kamienska",
                        "halina.kamienska3612@gmail.com",
                        "662386326",
                        true,
                        Role.MODERATOR,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "user",
                        "5M2fC1bQ",
                        "Zuzanna",
                        "Giertych",
                        "zuzanna.giertych1196@gmail.com",
                        "607386937",
                        true,
                        Role.USER,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "user_sob",
                        "TpA4ngto",
                        "Kornelia",
                        "Sobczynska",
                        "kornelia.sobczynska3202@gmail.com",
                        "991417604",
                        true,
                        Role.USER,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "user_jer",
                        "qWew71P0",
                        "Michał",
                        "Jerzak",
                        "michal.jerzak4983@gmail.com",
                        "702758897",
                        true,
                        Role.USER,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "user_kul",
                        "CBgm3Nrv",
                        "Stefan",
                        "Kulinski",
                        "stefan.kulinski8388@gmail.com",
                        "333229173",
                        true,
                        Role.USER,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "user_mic",
                        "HRlhuR67",
                        "Jerzy",
                        "Michno",
                        "jerzy.michno9332@gmail.com",
                        "262637472",
                        true,
                        Role.USER,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "user_waz",
                        "Ybjo1Gru",
                        "Michal",
                        "Wazowski",
                        "michal.wazowski9020@gmail.com",
                        "460515555",
                        true,
                        Role.USER,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "user_bie_krz",
                        "3PCOA6Ao",
                        "Krzysztof",
                        "Bielak",
                        "krzysztof.bielak4152@gmail.com",
                        "168130688",
                        true,
                        Role.USER,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "user_zub_mat",
                        "OcCEdD6l",
                        "Mateusz",
                        "Zubek",
                        "mateusz.zubek3408@gmail.com",
                        "945442735",
                        true,
                        Role.USER,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "user_fia_fil",
                        "73wxrIm9",
                        "Filip",
                        "Fialkowski",
                        "filip.fialkowski6444@gmail.com",
                        "411422855",
                        true,
                        Role.USER,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "user_fil_rob",
                        "weIMW1O9",
                        "Robert",
                        "Filan",
                        "robert.filan2085@gmail.com",
                        "162988145",
                        true,
                        Role.USER,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "user_zyl_nik",
                        "WLhQi6gi",
                        "Nikodem",
                        "Zyla",
                        "nikodem.zyla9010@gmail.com",
                        "172856301",
                        true,
                        Role.USER,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "user_fra_luk",
                        "Y2qWaW3A",
                        "Łukasz",
                        "Franc",
                        "lukasz.franc7575@gmail.com",
                        "281506654",
                        true,
                        Role.USER,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "user_rum_mar",
                        "TmdnKr2Z",
                        "Mariusz",
                        "Ruminski",
                        "mariusz.ruminski4387@gmail.com",
                        "943157548",
                        true,
                        Role.USER,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "user_prz_dar",
                        "ufgF57nq",
                        "Dariusz",
                        "Przybyszewski",
                        "dariusz.przybyszewski8263@gmail.com",
                        "481361620",
                        true,
                        Role.USER,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "user_ber_gra",
                        "Aofkx7BC",
                        "Grażyna",
                        "Bereza",
                        "grazyna.bereza4794@gmail.com",
                        "525852050",
                        true,
                        Role.USER,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "user_poc_luc",
                        "a3P4mH07",
                        "Lucyna",
                        "Pociask",
                        "lucyna.pociask8433@gmail.com",
                        "790540150",
                        true,
                        Role.USER,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "user_was_kry",
                        "O9H90uTJ",
                        "Krystyna",
                        "Wasko",
                        "krystyna.wasko5594@gmail.com",
                        "889104495",
                        true,
                        Role.USER,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "user_les_bar",
                        "FVnzcns5",
                        "Barbara",
                        "Lesak",
                        "barbara.lesak4474@gmail.com",
                        "963386317",
                        true,
                        Role.USER,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "user_fal_edw",
                        "z1WYquLL",
                        "Edward",
                        "Falkowski",
                        "edward.falkowski2311@gmail.com",
                        "827669891",
                        true,
                        Role.USER,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "user_kos_win",
                        "TKNI4X2g",
                        "Wincenty",
                        "Kostka",
                        "wincenty.kostka4672@gmail.com",
                        "896274278",
                        true,
                        Role.USER,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "user_ign_dze",
                        "H97NN3xZ",
                        "Dżesika",
                        "Ignatowska",
                        "dzesika.ignatowska6987@gmail.com",
                        "460808376",
                        true,
                        Role.USER,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "user_kry_rok",
                        "xGNp01Xi",
                        "Roksana",
                        "Kryszak",
                        "roksana.kryszak2878@gmail.com",
                        "510676502",
                        true,
                        Role.USER,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "user_kem_mar",
                        "kVqjq419",
                        "Marian",
                        "Kempka",
                        "marian.kempka2425@gmail.com",
                        "276986682",
                        true,
                        Role.USER,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "user_les_ant",
                        "4TNXelso",
                        "Antoni",
                        "Leszczynski",
                        "antoni.leszczynski7188@gmail.com",
                        "667887826",
                        true,
                        Role.USER,
                        Set.of()));
        userService.createUser(
                new UserDtoFormCreate(
                        "E2E_ADMIN",
                        "e2e_ADMIN1@",
                        "E2E",
                        "ADMIN",
                        "admin@e2e.test",
                        "111111111",
                        true,
                        Role.ADMIN,
                        Set.of()));

        universityService.addNewUniversity(
                new UniversityDtoFormCreate(
                        "Poznań University of Technology",
                        "PUT",
                        "blank",
                        1L,
                        "Piotrowo 3, 60-965 Poznań",
                        "https://www.put.poznan.pl/"));
        universityService.setUniversityImage(1L, "/static/put_logo.jpg");
        universityService.addNewUniversity(
                new UniversityDtoFormCreate(
                        "Adam Mickiewicz University in Poznań",
                        "UAM",
                        "blank",
                        1L,
                        "Uniwersytet im. Adama Mickiewicza w Poznaniu, ul. Wieniawskiego 1, 61-712 Poznań",
                        "https://amu.edu.pl/"));
        universityService.setUniversityImage(2L, "/static/uam_logo.png");
        universityService.addNewUniversity(
                new UniversityDtoFormCreate(
                        "Poznań University of Medical Sciences",
                        "PUMS",
                        "blank",
                        1L,
                        "ul. Rokietnicka 5, 60-806 Poznań",
                        "https://pums.edu.pl/"));
        universityService.setUniversityImage(3L, "/static/pums_logo.png");
        universityService.addNewUniversity(
                new UniversityDtoFormCreate(
                        "Poznań University of Economics and Business",
                        "PUEB",
                        "blank",
                        1L,
                        "al. Niepodległości 10, 61-875 Poznań",
                        "https://ue.poznan.pl/"));
        universityService.addNewUniversity(
                new UniversityDtoFormCreate(
                        "University of Fine Arts in Poznań",
                        "UFAP",
                        "blank",
                        2L,
                        "ul. Wojska Polskiego 121, 60-624 Poznań",
                        "https://uap.edu.pl/"));
        universityService.setUniversityImage(5L, "/static/ufa_logo.png");
        universityService.addNewUniversity(
                new UniversityDtoFormCreate(
                        "Wroclaw University of Technology",
                        "WUT",
                        "blank",
                        2L,
                        "Wybrzeże Wyspiańskiego 27, 50-370 Wrocław",
                        "https://pwr.edu.pl/"));
        universityService.setUniversityImage(6L, "/static/wut_logo.jpg");
        universityService.addNewUniversity(
                new UniversityDtoFormCreate(
                        "Karol Lipiński Academy of Music in Wrocław",
                        "KLAMW",
                        "blank",
                        2L,
                        "pl. Jana Pawła II 2, 50-043 Wrocław",
                        "https://amuz.wroc.pl/"));
        universityService.addNewUniversity(
                new UniversityDtoFormCreate(
                        "Gdynia Maritime University",
                        "GMU",
                        "blank",
                        3L,
                        "ul. Morska 81-87, 81-225 Gdynia",
                        "https://www.am.gdynia.pl/"));
        universityService.setUniversityImage(8L, "/static/gmu_logo.png");
        universityService.addNewUniversity(
                new UniversityDtoFormCreate(
                        "Chopin University of Music",
                        "CUM",
                        "blank",
                        3L,
                        "ul. Okólnik 2, 00-368 Warszawa",
                        "https://www.chopin.edu.pl/"));
        universityService.addNewUniversity(
                new UniversityDtoFormCreate(
                        "University of Szczecin",
                        "US",
                        "blank",
                        3L,
                        "ul. Krakowska 71-79, 71-017 Szczecin",
                        "https://www.us.szc.pl/"));
        universityService.setUniversityImage(10L, "/static/us_logo.jpg");

        universityService.update(1L, new UniversityDtoFormUpdate(null, null, null, null, null, false));
        universityService.update(2L, new UniversityDtoFormUpdate(null, null, null, null, null, false));
        universityService.update(3L, new UniversityDtoFormUpdate(null, null, null, null, null, false));
        universityService.update(4L, new UniversityDtoFormUpdate(null, null, null, null, null, false));
        universityService.update(5L, new UniversityDtoFormUpdate(null, null, null, null, null, true));
        universityService.update(6L, new UniversityDtoFormUpdate(null, null, null, null, null, false));
        universityService.update(7L, new UniversityDtoFormUpdate(null, null, null, null, null, false));
        universityService.update(8L, new UniversityDtoFormUpdate(null, null, null, null, null, false));
        universityService.update(9L, new UniversityDtoFormUpdate(null, null, null, null, null, true));
        universityService.update(10L, new UniversityDtoFormUpdate(null, null, null, null, null, false));

        universityService.enrollUsersToUniversity(1L, 4L);
        universityService.enrollUsersToUniversity(1L, 17L);
        universityService.enrollUsersToUniversity(1L, 18L);
        universityService.enrollUsersToUniversity(2L, 5L);
        universityService.enrollUsersToUniversity(2L, 19L);
        universityService.enrollUsersToUniversity(2L, 20L);
        universityService.enrollUsersToUniversity(3L, 6L);
        universityService.enrollUsersToUniversity(3L, 21L);
        universityService.enrollUsersToUniversity(3L, 22L);
        universityService.enrollUsersToUniversity(4L, 7L);
        universityService.enrollUsersToUniversity(4L, 23L);
        universityService.enrollUsersToUniversity(4L, 24L);
        universityService.enrollUsersToUniversity(5L, 8L);
        universityService.enrollUsersToUniversity(5L, 25L);
        universityService.enrollUsersToUniversity(5L, 26L);
        universityService.enrollUsersToUniversity(6L, 9L);
        universityService.enrollUsersToUniversity(6L, 27L);
        universityService.enrollUsersToUniversity(6L, 28L);
        universityService.enrollUsersToUniversity(7L, 10L);
        universityService.enrollUsersToUniversity(7L, 29L);
        universityService.enrollUsersToUniversity(7L, 30L);
        universityService.enrollUsersToUniversity(8L, 11L);
        universityService.enrollUsersToUniversity(8L, 31L);
        universityService.enrollUsersToUniversity(8L, 32L);
        universityService.enrollUsersToUniversity(9L, 12L);
        universityService.enrollUsersToUniversity(9L, 33L);
        universityService.enrollUsersToUniversity(9L, 34L);
        universityService.enrollUsersToUniversity(10L, 13L);
        universityService.enrollUsersToUniversity(10L, 35L);
        universityService.enrollUsersToUniversity(10L, 36L);

        pageService.save(
                new PageDtoFormCreate(
                        "Education",
                        "The list of courses we offer.",
                        "<section>\n"
                                + "        <h2>Undergraduate Programs</h2>\n"
                                + "        <p>Discover our range of undergraduate programs in engineering and technology fields.</p>\n"
                                + "        <ul>\n"
                                + "            <li>Computer Science</li>\n"
                                + "            <li>Electrical Engineering</li>\n"
                                + "            <li>Civil Engineering</li>\n"
                                + "        </ul>\n"
                                + "    </section>\n"
                                + "    <section>\n"
                                + "        <h2>Graduate Programs</h2>\n"
                                + "        <p>Explore advanced studies in various engineering disciplines.</p>\n"
                                + "        <ul>\n"
                                + "            <li>Mechanical Engineering</li>\n"
                                + "            <li>Chemical Engineering</li>\n"
                                + "            <li>Architecture</li>\n"
                                + "        </ul>\n"
                                + "    </section>",
                        4L,
                        1L,
                        false));
        pageService.save(
                new PageDtoFormCreate(
                        "Computer Science",
                        "The Bachelor of Science in Computer Science program at Poznań University of Technology provides a comprehensive foundation in computer science theory and practical programming skills.",
                        " <section>\n"
                                + "        <h2>Program Overview</h2>\n"
                                + "        <p>Students will study a range of subjects including algorithms, data structures, software engineering, and database systems. The program also emphasizes hands-on projects and collaborative learning.</p>\n"
                                + "    </section>\n"
                                + "    <section>\n"
                                + "        <h2>Key Courses</h2>\n"
                                + "        <ul>\n"
                                + "            <li>Introduction to Algorithms</li>\n"
                                + "            <li>Object-Oriented Programming</li>\n"
                                + "            <li>Database Systems</li>\n"
                                + "            <li>Software Engineering</li>\n"
                                + "        </ul>\n"
                                + "    </section>\n"
                                + "    <section>\n"
                                + "        <h2>Career Opportunities</h2>\n"
                                + "        <p>Graduates of this program are well-equipped for roles in software development, web development, database administration, and more.</p>\n"
                                + "    </section>",
                        4L,
                        11L,
                        false));
        pageService.save(
                new PageDtoFormCreate(
                        "Undergraduate Programs",
                        "Undergraduate Programs",
                        "    <section>\n"
                                + "        <h2>Bachelor of Science in Computer Science</h2>\n"
                                + "        <p>Explore the foundational principles of computer science and gain practical programming skills.</p>\n"
                                + "        <ul>\n"
                                + "            <li>Introduction to Algorithms</li>\n"
                                + "            <li>Object-Oriented Programming</li>\n"
                                + "            <li>Database Systems</li>\n"
                                + "        </ul>\n"
                                + "    </section>\n"
                                + "    <section>\n"
                                + "        <h2>Bachelor of Engineering in Electrical Engineering</h2>\n"
                                + "        <p>Study the core concepts of electrical engineering and specialize in areas like power systems or electronics.</p>\n"
                                + "        <ul>\n"
                                + "            <li>Electric Circuits</li>\n"
                                + "            <li>Signals and Systems</li>\n"
                                + "            <li>Power Electronics</li>\n"
                                + "        </ul>\n"
                                + "    </section>",
                        4L,
                        12L,
                        false));
        pageService.save(
                new PageDtoFormCreate(
                        "Graduate Programs",
                        "Graduate Programs",
                        " <section>\n"
                                + "        <h2>Master of Science in Mechanical Engineering</h2>\n"
                                + "        <p>Deepen your knowledge in mechanical engineering with advanced coursework and research opportunities.</p>\n"
                                + "        <ul>\n"
                                + "            <li>Finite Element Analysis</li>\n"
                                + "            <li>Advanced Thermodynamics</li>\n"
                                + "            <li>Robotics and Automation</li>\n"
                                + "        </ul>\n"
                                + "    </section>\n"
                                + "    <section>\n"
                                + "        <h2>Master of Engineering in Chemical Engineering</h2>\n"
                                + "        <p>Specialize in chemical process engineering or materials engineering with advanced coursework and projects.</p>\n"
                                + "        <ul>\n"
                                + "            <li>Chemical Reactor Design</li>\n"
                                + "            <li>Polymer Science</li>\n"
                                + "            <li>Process Safety</li>\n"
                                + "        </ul>\n"
                                + "    </section>",
                        4L,
                        12L,
                        false));
        pageService.save(
                new PageDtoFormCreate(
                        "Engineering in Electrical Engineering",
                        "The Bachelor of Engineering in Electrical Engineering program at Poznań University of Technology offers a solid foundation in electrical engineering principles and specialized knowledge in areas like power systems or electronics.",
                        "<section>\n"
                                + "        <h2>Program Overview</h2>\n"
                                + "        <p>Students will study subjects including electric circuits, signals and systems, and power electronics. The program also includes hands-on labs and practical projects.</p>\n"
                                + "    </section>\n"
                                + "    <section>\n"
                                + "        <h2>Specializations</h2>\n"
                                + "        <ul>\n"
                                + "            <li>Power Systems</li>\n"
                                + "            <li>Electronics</li>\n"
                                + "            <li>Control Systems</li>\n"
                                + "        </ul>\n"
                                + "    </section>\n"
                                + "    <section>\n"
                                + "        <h2>Career Paths</h2>\n"
                                + "        <p>Graduates are prepared for careers in power generation and distribution, electronics design, control systems engineering, and more.</p>\n"
                                + "    </section>",
                        4L,
                        11L,
                        false));
        pageService.save(
                new PageDtoFormCreate(
                        "Research",
                        "At Poznań University of Technology, we're dedicated to cutting-edge research that drives innovation.",
                        "<section>\n"
                                + "        <h2>Research Areas</h2>\n"
                                + "        <ul>\n"
                                + "            <li>Artificial Intelligence</li>\n"
                                + "            <li>Green Energy Technologies</li>\n"
                                + "            <li>Advanced Materials</li>\n"
                                + "        </ul>\n"
                                + "    </section>\n"
                                + "    <section>\n"
                                + "        <h2>Research Facilities</h2>\n"
                                + "        <p>Explore our state-of-the-art labs and centers for scientific discovery.</p>\n"
                                + "        <ul>\n"
                                + "            <li>Robotics Lab</li>\n"
                                + "            <li>Nanotechnology Center</li>\n"
                                + "            <li>Environmental Engineering Lab</li>\n"
                                + "        </ul>\n"
                                + "    </section>",
                        4L,
                        1L,
                        false));
        pageService.save(
                new PageDtoFormCreate(
                        "International Programs",
                        "Explore opportunities for international students to study at Poznań University of Technology.",
                        "<section>\n"
                                + "        <h2>Exchange Programs</h2>\n"
                                + "        <p>Information on exchange partnerships and study abroad opportunities.</p>\n"
                                + "    </section>\n"
                                + "    <section>\n"
                                + "        <h2>English-Taught Programs</h2>\n"
                                + "        <p>Discover programs offered in English for international students.</p>\n"
                                + "    </section>",
                        17L,
                        1L,
                        false));
        pageService.save(
                new PageDtoFormCreate(
                        "Facilities",
                        "Facilities",
                        "    <section>\n"
                                + "        <h2>Libraries</h2>\n"
                                + "        <p>Explore our well-equipped libraries with extensive collections of engineering and technology resources.</p>\n"
                                + "    </section>\n"
                                + "    <section>\n"
                                + "        <h2>Laboratories</h2>\n"
                                + "        <p>Information about specialized labs supporting hands-on learning and research.</p>\n"
                                + "        <ul>\n"
                                + "            <li>Advanced Materials Lab</li>\n"
                                + "            <li>Robotics and Automation Lab</li>\n"
                                + "            <li>Fluid Dynamics Lab</li>\n"
                                + "        </ul>\n"
                                + "    </section>",
                        17L,
                        1L,
                        false));
        pageService.save(
                new PageDtoFormCreate(
                        "Contact",
                        "Get in touch with us for inquiries, admissions, and general information about Poznań University of Technology.",
                        "<section>\n"
                                + "        <h2>Admissions Office</h2>\n"
                                + "        <p>Contact details for the admissions office for prospective students.</p>\n"
                                + "    </section>\n"
                                + "    <section>\n"
                                + "        <h2>General Inquiries</h2>\n"
                                + "        <p>For any other questions or information, feel free to reach out to our main office.</p>\n"
                                + "    </section>",
                        18L,
                        1L,
                        false));
        pageService.save(
                new PageDtoFormCreate(
                        "Student Life",
                        "Discover the vibrant campus life and opportunities for personal growth at Poznań University of Technology.",
                        "    <section>\n"
                                + "        <h2>Clubs and Organizations</h2>\n"
                                + "        <p>Get involved in student-led clubs and organizations covering various interests.</p>\n"
                                + "        <ul>\n"
                                + "            <li>Engineering Society</li>\n"
                                + "            <li>Debating Club</li>\n"
                                + "            <li>Chess Club</li>\n"
                                + "        </ul>\n"
                                + "    </section>\n"
                                + "    <section>\n"
                                + "        <h2>Student Services</h2>\n"
                                + "        <p>Find resources and support services to help you succeed academically and personally.</p>\n"
                                + "        <ul>\n"
                                + "            <li>Academic Advising</li>\n"
                                + "            <li>Counseling Services</li>\n"
                                + "            <li>Career Development</li>\n"
                                + "        </ul>\n"
                                + "    </section>",
                        18L,
                        1L,
                        false));

        pageService.save(
                new PageDtoFormCreate("Education", "The list of courses we offer.", "", 5L, 2L, false));
        pageService.save(
                new PageDtoFormCreate("Students", "News, education, work, sport...", "", 5L, 2L, false));
        pageService.save(
                new PageDtoFormCreate(
                        "Research",
                        "The list of research papers and other academic studies.",
                        "",
                        5L,
                        2L,
                        false));
        pageService.save(new PageDtoFormCreate("Business", "Services and experts", "", 19L, 2L, false));
        pageService.save(new PageDtoFormCreate("Staff", "The list of our staff.", "", 19L, 2L, false));
        pageService.save(
                new PageDtoFormCreate(
                        "Contact", "This page contains contact information.", "", 20L, 2L, false));
        pageService.save(
                new PageDtoFormCreate("History", "The history of our university.", "", 20L, 2L, false));
        pageService.save(new PageDtoFormCreate("News", "News for our students.", "", 5L, 22L, false));
        pageService.save(
                new PageDtoFormCreate(
                        "Academic Calendar", "Periods of academic education and days off", "", 5L, 22L, false));
        pageService.save(
                new PageDtoFormCreate(
                        "Student Offices",
                        "Student Offices are the first point of contact for you, the students of our university.",
                        "",
                        5L,
                        22L,
                        false));
        pageService.save(
                new PageDtoFormCreate(
                        "Research at AMU",
                        "The Adam Mickiewicz University in Poznań carries out its fundamental and unchanging mission.",
                        "",
                        5L,
                        23L,
                        false));
        pageService.save(
                new PageDtoFormCreate(
                        "AMU Research Portal",
                        "It is a platform that links the institutional repository with the Current Research Information System (CRIS) system. It functions as part of the Omega-Psir software.",
                        "",
                        5L,
                        23L,
                        false));

        pageService.save(
                new PageDtoFormCreate("Education", "The list of courses we offer.", "", 6L, 3L, false));
        pageService.save(
                new PageDtoFormCreate(
                        "Research",
                        "The list of research papers and other academic studies.",
                        "",
                        6L,
                        3L,
                        false));
        pageService.save(new PageDtoFormCreate("Business", "Services and experts", "", 21L, 3L, false));
        pageService.save(new PageDtoFormCreate("Staff", "The list of our staff.", "", 21L, 3L, false));
        pageService.save(
                new PageDtoFormCreate(
                        "Contact", "This page contains contact information.", "", 22L, 3L, false));
        pageService.save(
                new PageDtoFormCreate("History", "The history of our university.", "", 22L, 3L, false));

        pageService.save(
                new PageDtoFormCreate("Education", "The list of courses we offer.", "", 7L, 4L, false));
        pageService.save(
                new PageDtoFormCreate(
                        "Research",
                        "The list of research papers and other academic studies.",
                        "",
                        7L,
                        4L,
                        false));
        pageService.save(new PageDtoFormCreate("Business", "Services and experts", "", 23L, 4L, false));
        pageService.save(new PageDtoFormCreate("Staff", "The list of our staff.", "", 23L, 4L, false));
        pageService.save(
                new PageDtoFormCreate(
                        "Contact", "This page contains contact information.", "", 24L, 4L, false));
        pageService.save(
                new PageDtoFormCreate("History", "The history of our university.", "", 24L, 4L, false));

        pageService.save(
                new PageDtoFormCreate("Education", "The list of courses we offer.", "", 8L, 5L, false));
        pageService.save(
                new PageDtoFormCreate(
                        "Research",
                        "The list of research papers and other academic studies.",
                        "",
                        8L,
                        5L,
                        false));
        pageService.save(new PageDtoFormCreate("Business", "Services and experts", "", 25L, 5L, false));
        pageService.save(new PageDtoFormCreate("Staff", "The list of our staff.", "", 25L, 5L, false));
        pageService.save(
                new PageDtoFormCreate(
                        "Contact", "This page contains contact information.", "", 26L, 5L, false));
        pageService.save(
                new PageDtoFormCreate("History", "The history of our university.", "", 26L, 5L, false));

        pageService.save(
                new PageDtoFormCreate("Education", "The list of courses we offer.", "", 9L, 6L, false));
        pageService.save(
                new PageDtoFormCreate(
                        "Research",
                        "The list of research papers and other academic studies.",
                        "",
                        9L,
                        6L,
                        false));
        pageService.save(new PageDtoFormCreate("Business", "Services and experts", "", 27L, 6L, false));
        pageService.save(new PageDtoFormCreate("Staff", "The list of our staff.", "", 27L, 6L, false));
        pageService.save(
                new PageDtoFormCreate(
                        "Contact", "This page contains contact information.", "", 28L, 6L, false));
        pageService.save(
                new PageDtoFormCreate("History", "The history of our university.", "", 28L, 6L, false));

        pageService.save(
                new PageDtoFormCreate("Education", "The list of courses we offer.", "", 10L, 7L, false));
        pageService.save(
                new PageDtoFormCreate(
                        "Research",
                        "The list of research papers and other academic studies.",
                        "",
                        10L,
                        7L,
                        false));
        pageService.save(new PageDtoFormCreate("Business", "Services and experts", "", 29L, 7L, false));
        pageService.save(new PageDtoFormCreate("Staff", "The list of our staff.", "", 29L, 7L, false));
        pageService.save(
                new PageDtoFormCreate(
                        "Contact", "This page contains contact information.", "", 30L, 7L, false));
        pageService.save(
                new PageDtoFormCreate("History", "The history of our university.", "", 30L, 7L, false));

        pageService.save(
                new PageDtoFormCreate("Education", "The list of courses we offer.", "", 11L, 8L, false));
        pageService.save(
                new PageDtoFormCreate(
                        "Research",
                        "The list of research papers and other academic studies.",
                        "",
                        11L,
                        8L,
                        false));
        pageService.save(new PageDtoFormCreate("Business", "Services and experts", "", 31L, 8L, false));
        pageService.save(new PageDtoFormCreate("Staff", "The list of our staff.", "", 31L, 8L, false));
        pageService.save(
                new PageDtoFormCreate(
                        "Contact", "This page contains contact information.", "", 32L, 8L, false));
        pageService.save(
                new PageDtoFormCreate("History", "The history of our university.", "", 32L, 8L, false));

        pageService.save(
                new PageDtoFormCreate("Education", "The list of courses we offer.", "", 12L, 9L, false));
        pageService.save(
                new PageDtoFormCreate(
                        "Research",
                        "The list of research papers and other academic studies.",
                        "",
                        12L,
                        9L,
                        false));
        pageService.save(new PageDtoFormCreate("Business", "Services and experts", "", 33L, 9L, false));
        pageService.save(new PageDtoFormCreate("Staff", "The list of our staff.", "", 33L, 9L, false));
        pageService.save(
                new PageDtoFormCreate(
                        "Contact", "This page contains contact information.", "", 34L, 9L, false));
        pageService.save(
                new PageDtoFormCreate("History", "The history of our university.", "", 34L, 9L, false));

        pageService.save(
                new PageDtoFormCreate("Education", "The list of courses we offer.", "", 13L, 10L, false));
        pageService.save(
                new PageDtoFormCreate(
                        "Research",
                        "The list of research papers and other academic studies.",
                        "",
                        13L,
                        10L,
                        false));
        pageService.save(
                new PageDtoFormCreate("Business", "Services and experts", "", 35L, 10L, false));
        pageService.save(new PageDtoFormCreate("Staff", "The list of our staff.", "", 35L, 10L, false));
        pageService.save(
                new PageDtoFormCreate(
                        "Contact", "This page contains contact information.", "", 36L, 10L, false));
        pageService.save(
                new PageDtoFormCreate("History", "The history of our university.", "", 36L, 10L, false));

        pageService.update(
                1L,
                new PageDtoFormUpdate(
                        "Education",
                        "The list of courses we offer.",
                        "<section>\n"
                                + "        <h2>Undergraduate Programs</h2>\n"
                                + "        <p>Discover our range of undergraduate programs in engineering and technology fields.</p>\n"
                                + "        <ul>\n"
                                + "            <li>Computer Science</li>\n"
                                + "            <li>Electrical Engineering</li>\n"
                                + "            <li>Civil Engineering</li>\n"
                                + "        </ul>\n"
                                + "    </section>\n"
                                + "    <section>\n"
                                + "        <h2>Graduate Programs</h2>\n"
                                + "        <p>Explore advanced studies in various engineering disciplines.</p>\n"
                                + "        <ul>\n"
                                + "            <li>Mechanical Engineering</li>\n"
                                + "            <li>Chemical Engineering</li>\n"
                                + "            <li>Architecture</li>\n"
                                + "        </ul>\n"
                                + "    </section>",
                        false,
                        Set.of(5L, 7L),
                        null));
        pageService.update(
                2L,
                new PageDtoFormUpdate(
                        "Computer Science",
                        "The Bachelor of Science in Computer Science program at Poznań University of Technology provides a comprehensive foundation in computer science theory and practical programming skills.",
                        " <section>\n"
                                + "        <h2>Program Overview</h2>\n"
                                + "        <p>Students will study a range of subjects including algorithms, data structures, software engineering, and database systems. The program also emphasizes hands-on projects and collaborative learning.</p>\n"
                                + "    </section>\n"
                                + "    <section>\n"
                                + "        <h2>Key Courses</h2>\n"
                                + "        <ul>\n"
                                + "            <li>Introduction to Algorithms</li>\n"
                                + "            <li>Object-Oriented Programming</li>\n"
                                + "            <li>Database Systems</li>\n"
                                + "            <li>Software Engineering</li>\n"
                                + "        </ul>\n"
                                + "    </section>\n"
                                + "    <section>\n"
                                + "        <h2>Career Opportunities</h2>\n"
                                + "        <p>Graduates of this program are well-equipped for roles in software development, web development, database administration, and more.</p>\n"
                                + "    </section>",
                        false,
                        Set.of(5L, 6L, 7L),
                        null));
        pageService.update(
                3L,
                new PageDtoFormUpdate(
                        "Undergraduate Programs",
                        "Undergraduate Programs",
                        "    <section>\n"
                                + "        <h2>Bachelor of Science in Computer Science</h2>\n"
                                + "        <p>Explore the foundational principles of computer science and gain practical programming skills.</p>\n"
                                + "        <ul>\n"
                                + "            <li>Introduction to Algorithms</li>\n"
                                + "            <li>Object-Oriented Programming</li>\n"
                                + "            <li>Database Systems</li>\n"
                                + "        </ul>\n"
                                + "    </section>\n"
                                + "    <section>\n"
                                + "        <h2>Bachelor of Engineering in Electrical Engineering</h2>\n"
                                + "        <p>Study the core concepts of electrical engineering and specialize in areas like power systems or electronics.</p>\n"
                                + "        <ul>\n"
                                + "            <li>Electric Circuits</li>\n"
                                + "            <li>Signals and Systems</li>\n"
                                + "            <li>Power Electronics</li>\n"
                                + "        </ul>\n"
                                + "    </section>",
                        false,
                        Set.of(5L, 7L, 4L),
                        null));
        pageService.update(
                4L,
                new PageDtoFormUpdate(
                        "Undergraduate Programs",
                        "Undergraduate Programs",
                        "    <section>\n"
                                + "        <h2>Bachelor of Science in Computer Science</h2>\n"
                                + "        <p>Explore the foundational principles of computer science and gain practical programming skills.</p>\n"
                                + "        <ul>\n"
                                + "            <li>Introduction to Algorithms</li>\n"
                                + "            <li>Object-Oriented Programming</li>\n"
                                + "            <li>Database Systems</li>\n"
                                + "        </ul>\n"
                                + "    </section>\n"
                                + "    <section>\n"
                                + "        <h2>Bachelor of Engineering in Electrical Engineering</h2>\n"
                                + "        <p>Study the core concepts of electrical engineering and specialize in areas like power systems or electronics.</p>\n"
                                + "        <ul>\n"
                                + "            <li>Electric Circuits</li>\n"
                                + "            <li>Signals and Systems</li>\n"
                                + "            <li>Power Electronics</li>\n"
                                + "        </ul>\n"
                                + "    </section>",
                        false,
                        Set.of(5L, 6L, 4L, 7L),
                        null));
        pageService.update(
                5L,
                new PageDtoFormUpdate(
                        "Graduate Programs",
                        "Graduate Programs",
                        " <section>\n"
                                + "        <h2>Master of Science in Mechanical Engineering</h2>\n"
                                + "        <p>Deepen your knowledge in mechanical engineering with advanced coursework and research opportunities.</p>\n"
                                + "        <ul>\n"
                                + "            <li>Finite Element Analysis</li>\n"
                                + "            <li>Advanced Thermodynamics</li>\n"
                                + "            <li>Robotics and Automation</li>\n"
                                + "        </ul>\n"
                                + "    </section>\n"
                                + "    <section>\n"
                                + "        <h2>Master of Engineering in Chemical Engineering</h2>\n"
                                + "        <p>Specialize in chemical process engineering or materials engineering with advanced coursework and projects.</p>\n"
                                + "        <ul>\n"
                                + "            <li>Chemical Reactor Design</li>\n"
                                + "            <li>Polymer Science</li>\n"
                                + "            <li>Process Safety</li>\n"
                                + "        </ul>\n"
                                + "    </section>",
                        false,
                        Set.of(5L, 22L),
                        null));
        pageService.update(
                6L,
                new PageDtoFormUpdate(
                        "Engineering in Electrical Engineering",
                        "The Bachelor of Engineering in Electrical Engineering program at Poznań University of Technology offers a solid foundation in electrical engineering principles and specialized knowledge in areas like power systems or electronics.",
                        "<section>\n"
                                + "        <h2>Program Overview</h2>\n"
                                + "        <p>Students will study subjects including electric circuits, signals and systems, and power electronics. The program also includes hands-on labs and practical projects.</p>\n"
                                + "    </section>\n"
                                + "    <section>\n"
                                + "        <h2>Specializations</h2>\n"
                                + "        <ul>\n"
                                + "            <li>Power Systems</li>\n"
                                + "            <li>Electronics</li>\n"
                                + "            <li>Control Systems</li>\n"
                                + "        </ul>\n"
                                + "    </section>\n"
                                + "    <section>\n"
                                + "        <h2>Career Paths</h2>\n"
                                + "        <p>Graduates are prepared for careers in power generation and distribution, electronics design, control systems engineering, and more.</p>\n"
                                + "    </section>",
                        false,
                        Set.of(),
                        null));
        pageService.update(
                7L,
                new PageDtoFormUpdate(
                        "Research",
                        "At Poznań University of Technology, we're dedicated to cutting-edge research that drives innovation.",
                        "<section>\n"
                                + "        <h2>Research Areas</h2>\n"
                                + "        <ul>\n"
                                + "            <li>Artificial Intelligence</li>\n"
                                + "            <li>Green Energy Technologies</li>\n"
                                + "            <li>Advanced Materials</li>\n"
                                + "        </ul>\n"
                                + "    </section>\n"
                                + "    <section>\n"
                                + "        <h2>Research Facilities</h2>\n"
                                + "        <p>Explore our state-of-the-art labs and centers for scientific discovery.</p>\n"
                                + "        <ul>\n"
                                + "            <li>Robotics Lab</li>\n"
                                + "            <li>Nanotechnology Center</li>\n"
                                + "            <li>Environmental Engineering Lab</li>\n"
                                + "        </ul>\n"
                                + "    </section>",
                        false,
                        Set.of(),
                        null));
        pageService.update(
                8L,
                new PageDtoFormUpdate(
                        "International Programs",
                        "Explore opportunities for international students to study at Poznań University of Technology.",
                        "<section>\n"
                                + "        <h2>Exchange Programs</h2>\n"
                                + "        <p>Information on exchange partnerships and study abroad opportunities.</p>\n"
                                + "    </section>\n"
                                + "    <section>\n"
                                + "        <h2>English-Taught Programs</h2>\n"
                                + "        <p>Discover programs offered in English for international students.</p>\n"
                                + "    </section>",
                        false,
                        Set.of(),
                        null));
        pageService.update(
                9L,
                new PageDtoFormUpdate(
                        "Facilities",
                        "Facilities",
                        "    <section>\n"
                                + "        <h2>Libraries</h2>\n"
                                + "        <p>Explore our well-equipped libraries with extensive collections of engineering and technology resources.</p>\n"
                                + "    </section>\n"
                                + "    <section>\n"
                                + "        <h2>Laboratories</h2>\n"
                                + "        <p>Information about specialized labs supporting hands-on learning and research.</p>\n"
                                + "        <ul>\n"
                                + "            <li>Advanced Materials Lab</li>\n"
                                + "            <li>Robotics and Automation Lab</li>\n"
                                + "            <li>Fluid Dynamics Lab</li>\n"
                                + "        </ul>\n"
                                + "    </section>",
                        false,
                        Set.of(),
                        null));
        pageService.update(
                10L,
                new PageDtoFormUpdate(
                        "Contact",
                        "Get in touch with us for inquiries, admissions, and general information about Poznań University of Technology.",
                        "<section>\n"
                                + "        <h2>Admissions Office</h2>\n"
                                + "        <p>Contact details for the admissions office for prospective students.</p>\n"
                                + "    </section>\n"
                                + "    <section>\n"
                                + "        <h2>General Inquiries</h2>\n"
                                + "        <p>For any other questions or information, feel free to reach out to our main office.</p>\n"
                                + "    </section>",
                        true,
                        Set.of(),
                        null));

        templateService.save(
                new TemplateDtoFormCreate(
                        "UniversityTemplate", "Template used for university main page", Set.of(), true));

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken("admin", "51D7k4F8"));

        UUID ticketId1 =
                ticketService.createTicket(
                        new TicketDtoFormCreate(
                                1L,
                                "michal.wazowski9020@gmail.com",
                                "Problem to page 1",
                                "This is description to my ticket. I have a problem with page 1"));
        UUID ticketId2 =
                ticketService.createTicket(
                        new TicketDtoFormCreate(
                                2L,
                                "requester2@email.com",
                                "Problem to page 2",
                                "This is description to my ticket. I have a problem with page 2"));
        UUID ticketId3 =
                ticketService.createTicket(
                        new TicketDtoFormCreate(
                                3L,
                                "requester3@email.com",
                                "Problem to page 3",
                                "This is description to my ticket. I have a problem with page 3"));
        UUID ticketId4 =
                ticketService.createTicket(
                        new TicketDtoFormCreate(
                                4L,
                                "requester4@email.com",
                                "Problem to page 4",
                                "This is description to my ticket. I have a problem with page 4"));
        UUID ticketId5 =
                ticketService.createTicket(
                        new TicketDtoFormCreate(
                                4L,
                                "requester5@email.com",
                                "Second problem to page 4",
                                "This is description to my ticket. I have a second problem with page 5"));

        ticketService.addResponse(ticketId1, "message content to ticket 1 from author1");
        ticketService.addResponse(ticketId1, "another message content to ticket 1 from author1");
        ticketService.addResponse(ticketId1, "message content to ticket 1 from author2");
        ticketService.addResponse(ticketId2, "message content to ticket 2 from author3");
        ticketService.addResponse(ticketId2, "message content to ticket 2 from author4");
        ticketService.addResponse(ticketId3, "message content to ticket 3 from author5");
        ticketService.addResponse(ticketId3, "message content to ticket 3 from author6");
        ticketService.addResponse(ticketId3, "another message content to ticket 3 from author5");
        ticketService.addResponse(ticketId4, "message content to ticket 4 from author1");
        ticketService.addResponse(ticketId4, "message content to ticket 4 from author7");
    }
}
