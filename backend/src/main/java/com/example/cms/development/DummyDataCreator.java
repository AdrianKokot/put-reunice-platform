package com.example.cms.development;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.example.cms.backup.BackupService;
import com.example.cms.backup.exceptions.BackupException;
import com.example.cms.configuration.ApplicationConfigurationProvider;
import com.example.cms.keywords.KeyWordsService;
import com.example.cms.page.PageService;
import com.example.cms.page.projections.PageDtoFormCreate;
import com.example.cms.security.Role;
import com.example.cms.template.TemplateService;
import com.example.cms.university.UniversityService;
import com.example.cms.university.projections.UniversityDtoFormCreate;
import com.example.cms.user.UserService;
import com.example.cms.user.projections.UserDtoFormCreate;
import com.example.cms.validation.exceptions.WrongParameterException;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
class DummyDataCreator implements ApplicationListener<ContextRefreshedEvent> {

    private enum DatabaseSchemaCreateType {
        INITIALIZE, //create only main admin so the data can be added manually (e.g., using a frontend application)
        POPULATE    //insert dummy data to demonstrate the application
    }

    private final PageService pageService;
    private final UserService userService;
    private final UniversityService universityService;
    private final TemplateService templateService;
    private final BackupService backupService;
    private final KeyWordsService keyWordsService;

    @Autowired
    private ApplicationConfigurationProvider applicationConfigurationProvider;

    @Override
    public void onApplicationEvent(@NonNull final ContextRefreshedEvent event) {
        try {
            SecurityContext ctx = SecurityContextHolder.createEmptyContext();
            SecurityContextHolder.setContext(ctx);
            ctx.setAuthentication(CustomAuthenticationToken.create(Role.ADMIN, Set.of()));

            Files.createDirectories(backupService.getRestoreMainPath());
            Files.createDirectories(backupService.getBackupsMainPath());

            //MSz extended
            log.info(String.format("** databaseSchemaHandlingOnStartup read from properties file: %s", applicationConfigurationProvider.getDatabaseSchemaHandlingOnStartup()));
            if (applicationConfigurationProvider.getDatabaseSchemaHandlingOnStartup().equals("create")) {
                if (applicationConfigurationProvider.getDatabaseSchemaCreateType().equalsIgnoreCase("populate")) {
                    tryToRestoreDatabase(DatabaseSchemaCreateType.POPULATE);
                } else if (applicationConfigurationProvider.getDatabaseSchemaCreateType().equalsIgnoreCase("initialize")) {
                    tryToRestoreDatabase(DatabaseSchemaCreateType.INITIALIZE);
                } else {
                    throw new WrongParameterException("Invalid value of parameter databaseSchemaCreateType.");
                }
            } else {
                log.info("** Using encountered database schema.");
            }
        } catch (IOException e) {
            throw new BackupException();
        } finally {
            SecurityContextHolder.clearContext();
        }
    }

    /**
     * Checks if there is at least one zip file in the path returned by {@link BackupService#getRestoreMainPath()},
     * and if so, then takes randomly one of available zip files and tries to restore all tables in the database from that backup file.
     * If there is not a zip file in the path returned by {@link BackupService#getRestoreMainPath()}, then inserts data into the database based on the value of the parameter.
     *
     * @param databaseSchemaCreateType type of database schema create to perform on application startup if a backup is not available
     */
    private void tryToRestoreDatabase(DatabaseSchemaCreateType databaseSchemaCreateType) {
        Arrays.stream(Optional.ofNullable(backupService.getRestoreMainPath().toFile().listFiles()).orElseThrow(() -> {
                    throw new BackupException();
                }))
                .filter(File::isFile)
                .map(File::getName)
                .filter(fileName -> fileName.substring(fileName.lastIndexOf('.')).equals(".zip"))
                .map(fileName -> fileName.substring(0, fileName.lastIndexOf('.')))
                .findAny()
                .ifPresentOrElse(backupName -> {
                    try {
                        backupService.importBackup(backupName);
                    } catch (IOException | SQLException e) {
                        throw new BackupException();
                    }
                    log.info(String.format("** Imported %s backup.", backupName));
                }, () -> {
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
     * Creates minimum data for the application to be functional, i.e., only the main administrator account.
     */
    private void createInitialData() {
        userService.createUser(new UserDtoFormCreate(
                "admin",
                "51D7k4F8",
                "Name",
                "Surname",
                "__unique__email@gmail.com",
                "123456789",
                true,
                Role.ADMIN
        ));
    }

    /**
     * Creates some dummy data to be presented in the running application, so it can be tested manually in a browser
     * (users, universities, user enrollments, pages, keywords, and a template).
     */
    private void createDummyData() {
        userService.createUser(new UserDtoFormCreate(
                "admin",
                "51D7k4F8",
                "Wojciech",
                "Kowalski",
                "wojciech.kowalski7342@gmail.com",
                "935283642",
                true,
                Role.ADMIN
        ));
        userService.createUser(new UserDtoFormCreate(
                "admin_bar",
                "c9wahT0t",
                "Leszek",
                "Bartkiewicz",
                "leszek.bartkiewicz5229@gmail.com",
                "264878345",
                true,
                Role.ADMIN
        ));
        userService.createUser(new UserDtoFormCreate(
                "admin_ban",
                "2eqf1kYN",
                "Bożena",
                "Banik",
                "bozena.banik9987@gmail.com",
                "653916167",
                true,
                Role.ADMIN
        ));
        userService.createUser(new UserDtoFormCreate(
                "moderator",
                "5g7X92KL",
                "Szymon",
                "Koltun",
                "szymon.koltun8441@gmail.com",
                "311222995",
                true,
                Role.MODERATOR
        ));
        userService.createUser(new UserDtoFormCreate(
                "mod_zlo",
                "v4wUr5bC",
                "Roman",
                "Zlotkowski",
                "roman.zlotkowski9843@gmail.com",
                "739393723",
                true,
                Role.MODERATOR
        ));
        userService.createUser(new UserDtoFormCreate(
                "mod_rad",
                "ic1ER2ta",
                "Ferdynand",
                "Radecki",
                "ferdynand.radecki1321@gmail.com",
                "727456789",
                true,
                Role.MODERATOR
        ));
        userService.createUser(new UserDtoFormCreate(
                "mod_kos",
                "41rJ6kRM",
                "Mateusz",
                "Kostuch",
                "mateusz.kostuch2531@gmail.com",
                "672476734",
                true,
                Role.MODERATOR
        ));
        userService.createUser(new UserDtoFormCreate(
                "mod_szy",
                "EVKrFt2a",
                "Błażej",
                "Szymkowski",
                "blazej.szymkowski5231@gmail.com",
                "738350481",
                true,
                Role.MODERATOR
        ));
        userService.createUser(new UserDtoFormCreate(
                "mod_mie",
                "mTU4x1qJ",
                "Marcin",
                "Mieczkowski",
                "marcin.mieczkowski7235@gmail.com",
                "830393622",
                true,
                Role.MODERATOR
        ));
        userService.createUser(new UserDtoFormCreate(
                "mod_jus",
                "Md9pno1v",
                "Ewa",
                "Jusko",
                "ewa.jusko9033@gmail.com",
                "258683257",
                true,
                Role.MODERATOR
        ));
        userService.createUser(new UserDtoFormCreate(
                "mod_hal",
                "BDxm3IDG",
                "Eliza",
                "Halicka",
                "eliza.halicka8511@gmail.com",
                "852660762",
                true,
                Role.MODERATOR
        ));
        userService.createUser(new UserDtoFormCreate(
                "mod_ols",
                "2GuXiZCN",
                "Igor",
                "Olszowy",
                "igor.olszowy5729@gmail.com",
                "542395438",
                true,
                Role.MODERATOR
        ));
        userService.createUser(new UserDtoFormCreate(
                "mod_gor",
                "bnjIi1rp",
                "Tomasz",
                "Gorczyca",
                "tomasz.gorczyca2514@gmail.com",
                "481764007",
                true,
                Role.MODERATOR
        ));
        userService.createUser(new UserDtoFormCreate(
                "mod_sob",
                "S0FHytEq",
                "Anastazja",
                "Sobolewicz",
                "anastazja.sobolewicz7829@gmail.com",
                "343862564",
                true,
                Role.MODERATOR
        ));
        userService.createUser(new UserDtoFormCreate(
                "mod_smi",
                "VIWG10Ss",
                "Arkadiusz",
                "Śmiałek",
                "arkadiusz.smialek2512@gmail.com",
                "722351974",
                true,
                Role.MODERATOR
        ));
        userService.createUser(new UserDtoFormCreate(
                "mod_kam",
                "H7JmHV9H",
                "Halina",
                "Kamienska",
                "halina.kamienska3612@gmail.com",
                "662386326",
                true,
                Role.MODERATOR
        ));
        userService.createUser(new UserDtoFormCreate(
                "user",
                "5M2fC1bQ",
                "Zuzanna",
                "Giertych",
                "zuzanna.giertych1196@gmail.com",
                "607386937",
                true,
                Role.USER
        ));
        userService.createUser(new UserDtoFormCreate(
                "user_sob",
                "TpA4ngto",
                "Kornelia",
                "Sobczynska",
                "kornelia.sobczynska3202@gmail.com",
                "991417604",
                true,
                Role.USER
        ));
        userService.createUser(new UserDtoFormCreate(
                "user_jer",
                "qWew71P0",
                "Michał",
                "Jerzak",
                "michal.jerzak4983@gmail.com",
                "702758897",
                true,
                Role.USER
        ));
        userService.createUser(new UserDtoFormCreate(
                "user_kul",
                "CBgm3Nrv",
                "Stefan",
                "Kulinski",
                "stefan.kulinski8388@gmail.com",
                "333229173",
                true,
                Role.USER
        ));
        userService.createUser(new UserDtoFormCreate(
                "user_mic",
                "HRlhuR67",
                "Jerzy",
                "Michno",
                "jerzy.michno9332@gmail.com",
                "262637472",
                true,
                Role.USER
        ));
        userService.createUser(new UserDtoFormCreate(
                "user_waz",
                "Ybjo1Gru",
                "Michal",
                "Wazowski",
                "michal.wazowski9020@gmail.com",
                "460515555",
                true,
                Role.USER
        ));
        userService.createUser(new UserDtoFormCreate(
                "user_bie_krz",
                "3PCOA6Ao",
                "Krzysztof",
                "Bielak",
                "krzysztof.bielak4152@gmail.com",
                "168130688",
                true,
                Role.USER
        ));
        userService.createUser(new UserDtoFormCreate(
                "user_zub_mat",
                "OcCEdD6l",
                "Mateusz",
                "Zubek",
                "mateusz.zubek3408@gmail.com",
                "945442735",
                true,
                Role.USER
        ));
        userService.createUser(new UserDtoFormCreate(
                "user_fia_fil",
                "73wxrIm9",
                "Filip",
                "Fialkowski",
                "filip.fialkowski6444@gmail.com",
                "411422855",
                true,
                Role.USER
        ));
        userService.createUser(new UserDtoFormCreate(
                "user_fil_rob",
                "weIMW1O9",
                "Robert",
                "Filan",
                "robert.filan2085@gmail.com",
                "162988145",
                true,
                Role.USER
        ));
        userService.createUser(new UserDtoFormCreate(
                "user_zyl_nik",
                "WLhQi6gi",
                "Nikodem",
                "Zyla",
                "nikodem.zyla9010@gmail.com",
                "172856301",
                true,
                Role.USER
        ));
        userService.createUser(new UserDtoFormCreate(
                "user_fra_luk",
                "Y2qWaW3A",
                "Łukasz",
                "Franc",
                "lukasz.franc7575@gmail.com",
                "281506654",
                true,
                Role.USER
        ));
        userService.createUser(new UserDtoFormCreate(
                "user_rum_mar",
                "TmdnKr2Z",
                "Mariusz",
                "Ruminski",
                "mariusz.ruminski4387@gmail.com",
                "943157548",
                true,
                Role.USER
        ));
        userService.createUser(new UserDtoFormCreate(
                "user_prz_dar",
                "ufgF57nq",
                "Dariusz",
                "Przybyszewski",
                "dariusz.przybyszewski8263@gmail.com",
                "481361620",
                true,
                Role.USER
        ));
        userService.createUser(new UserDtoFormCreate(
                "user_ber_gra",
                "Aofkx7BC",
                "Grażyna",
                "Bereza",
                "grazyna.bereza4794@gmail.com",
                "525852050",
                true,
                Role.USER
        ));
        userService.createUser(new UserDtoFormCreate(
                "user_poc_luc",
                "a3P4mH07",
                "Lucyna",
                "Pociask",
                "lucyna.pociask8433@gmail.com",
                "790540150",
                true,
                Role.USER
        ));
        userService.createUser(new UserDtoFormCreate(
                "user_was_kry",
                "O9H90uTJ",
                "Krystyna",
                "Wasko",
                "krystyna.wasko5594@gmail.com",
                "889104495",
                true,
                Role.USER
        ));
        userService.createUser(new UserDtoFormCreate(
                "user_les_bar",
                "FVnzcns5",
                "Barbara",
                "Lesak",
                "barbara.lesak4474@gmail.com",
                "963386317",
                true,
                Role.USER
        ));
        userService.createUser(new UserDtoFormCreate(
                "user_fal_edw",
                "z1WYquLL",
                "Edward",
                "Falkowski",
                "edward.falkowski2311@gmail.com",
                "827669891",
                true,
                Role.USER
        ));
        userService.createUser(new UserDtoFormCreate(
                "user_kos_win",
                "TKNI4X2g",
                "Wincenty",
                "Kostka",
                "wincenty.kostka4672@gmail.com",
                "896274278",
                true,
                Role.USER
        ));
        userService.createUser(new UserDtoFormCreate(
                "user_ign_dze",
                "H97NN3xZ",
                "Dżesika",
                "Ignatowska",
                "dzesika.ignatowska6987@gmail.com",
                "460808376",
                true,
                Role.USER
        ));
        userService.createUser(new UserDtoFormCreate(
                "user_kry_rok",
                "xGNp01Xi",
                "Roksana",
                "Kryszak",
                "roksana.kryszak2878@gmail.com",
                "510676502",
                true,
                Role.USER
        ));
        userService.createUser(new UserDtoFormCreate(
                "user_kem_mar",
                "kVqjq419",
                "Marian",
                "Kempka",
                "marian.kempka2425@gmail.com",
                "276986682",
                true,
                Role.USER
        ));
        userService.createUser(new UserDtoFormCreate(
                "user_les_ant",
                "4TNXelso",
                "Antoni",
                "Leszczynski",
                "antoni.leszczynski7188@gmail.com",
                "667887826",
                true,
                Role.USER
        ));

        universityService.addNewUniversity(new UniversityDtoFormCreate(
                "Poznań University of Technology",
                "PUT",
                "blank",
                1L,
                "Piotrowo 3, 60-965 Poznań",
                "https://www.put.poznan.pl/"
        ));
        universityService.addNewUniversity(new UniversityDtoFormCreate(
                "Adam Mickiewicz University in Poznań",
                "UAM",
                "blank",
                1L,
                "Uniwersytet im. Adama Mickiewicza w Poznaniu, ul. Wieniawskiego 1, 61-712 Poznań",
                "https://amu.edu.pl/"
        ));
        universityService.addNewUniversity(new UniversityDtoFormCreate(
                "Poznań University of Medical Sciences",
                "PUMS",
                "blank",
                1L,
                "ul. Rokietnicka 5, 60-806 Poznań",
                "https://pums.edu.pl/"
        ));
        universityService.addNewUniversity(new UniversityDtoFormCreate(
                "Poznań University of Economics and Business",
                "PUEB",
                "blank",
                1L,
                "al. Niepodległości 10, 61-875 Poznań",
                "https://ue.poznan.pl/"
        ));
        universityService.addNewUniversity(new UniversityDtoFormCreate(
                "University of Fine Arts in Poznań",
                "UFAP",
                "blank",
                2L,
                "ul. Wojska Polskiego 121, 60-624 Poznań",
                "https://uap.edu.pl/"
        ));
        universityService.addNewUniversity(new UniversityDtoFormCreate(
                "Wroclaw University of Technology",
                "WUT",
                "blank",
                2L,
                "Wybrzeże Wyspiańskiego 27, 50-370 Wrocław",
                "https://pwr.edu.pl/"
        ));
        universityService.addNewUniversity(new UniversityDtoFormCreate(
                "Karol Lipiński Academy of Music in Wrocław",
                "KLAMW",
                "blank",
                2L,
                "pl. Jana Pawła II 2, 50-043 Wrocław",
                "https://amuz.wroc.pl/"
        ));
        universityService.addNewUniversity(new UniversityDtoFormCreate(
                "Gdynia Maritime University",
                "GMU",
                "blank",
                3L,
                "ul. Morska 81-87, 81-225 Gdynia",
                "https://www.am.gdynia.pl/"
        ));
        universityService.addNewUniversity(new UniversityDtoFormCreate(
                "Chopin University of Music",
                "CUM",
                "blank",
                3L,
                "ul. Okólnik 2, 00-368 Warszawa",
                "https://www.chopin.edu.pl/"
        ));
        universityService.addNewUniversity(new UniversityDtoFormCreate(
                "University of Szczecin",
                "US",
                "blank",
                3L,
                "ul. Krakowska 71-79, 71-017 Szczecin",
                "https://www.us.szc.pl/"
        ));

        universityService.modifyHiddenField(1L, false);
        universityService.modifyHiddenField(2L, false);
        universityService.modifyHiddenField(3L, false);
        universityService.modifyHiddenField(5L, false);
        universityService.modifyHiddenField(6L, false);
        universityService.modifyHiddenField(8L, false);
        universityService.modifyHiddenField(10L, false);

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

        pageService.save(new PageDtoFormCreate(
                "Education",
                "The list of courses we offer.",
                "",
                4L,
                1L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Computer Science",
                "Computers, math, programming...",
                "",
                4L,
                11L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "First degree",
                "First degree",
                "",
                4L,
                12L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Second degree",
                "Second degree",
                "",
                4L,
                12L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Telecommunication",
                "Computer networks, communication...",
                "",
                4L,
                11L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Research",
                "The list of research papers and other academic studies.",
                "",
                4L,
                1L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Business",
                "Services and experts",
                "",
                17L,
                1L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Staff",
                "The list of our staff.",
                "",
                17L,
                1L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Contact",
                "This page contains contact information.",
                "",
                18L,
                1L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "History",
                "The history of our university.",
                "",
                18L,
                1L,
                "",
                false
        ));

        pageService.save(new PageDtoFormCreate(
                "Education",
                "The list of courses we offer.",
                "",
                5L,
                2L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Students",
                "News, education, work, sport...",
                "",
                5L,
                2L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Research",
                "The list of research papers and other academic studies.",
                "",
                5L,
                2L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Business",
                "Services and experts",
                "",
                19L,
                2L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Staff",
                "The list of our staff.",
                "",
                19L,
                2L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Contact",
                "This page contains contact information.",
                "",
                20L,
                2L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "History",
                "The history of our university.",
                "",
                20L,
                2L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "News",
                "News for our students.",
                "",
                5L,
                22L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Academic Calendar",
                "Periods of academic education and days off",
                "",
                5L,
                22L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Student Offices",
                "Student Offices are the first point of contact for you, the students of our university.",
                "",
                5L,
                22L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Research at AMU",
                "The Adam Mickiewicz University in Poznań carries out its fundamental and unchanging mission.",
                "",
                5L,
                23L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "AMU Research Portal",
                "It is a platform that links the institutional repository with the Current Research Information System (CRIS) system. It functions as part of the Omega-Psir software.",
                "",
                5L,
                23L,
                "",
                false
        ));

        pageService.save(new PageDtoFormCreate(
                "Education",
                "The list of courses we offer.",
                "",
                6L,
                3L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Research",
                "The list of research papers and other academic studies.",
                "",
                6L,
                3L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Business",
                "Services and experts",
                "",
                21L,
                3L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Staff",
                "The list of our staff.",
                "",
                21L,
                3L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Contact",
                "This page contains contact information.",
                "",
                22L,
                3L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "History",
                "The history of our university.",
                "",
                22L,
                3L,
                "",
                false
        ));

        pageService.save(new PageDtoFormCreate(
                "Education",
                "The list of courses we offer.",
                "",
                7L,
                4L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Research",
                "The list of research papers and other academic studies.",
                "",
                7L,
                4L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Business",
                "Services and experts",
                "",
                23L,
                4L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Staff",
                "The list of our staff.",
                "",
                23L,
                4L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Contact",
                "This page contains contact information.",
                "",
                24L,
                4L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "History",
                "The history of our university.",
                "",
                24L,
                4L,
                "",
                false
        ));

        pageService.save(new PageDtoFormCreate(
                "Education",
                "The list of courses we offer.",
                "",
                8L,
                5L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Research",
                "The list of research papers and other academic studies.",
                "",
                8L,
                5L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Business",
                "Services and experts",
                "",
                25L,
                5L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Staff",
                "The list of our staff.",
                "",
                25L,
                5L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Contact",
                "This page contains contact information.",
                "",
                26L,
                5L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "History",
                "The history of our university.",
                "",
                26L,
                5L,
                "",
                false
        ));

        pageService.save(new PageDtoFormCreate(
                "Education",
                "The list of courses we offer.",
                "",
                9L,
                6L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Research",
                "The list of research papers and other academic studies.",
                "",
                9L,
                6L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Business",
                "Services and experts",
                "",
                27L,
                6L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Staff",
                "The list of our staff.",
                "",
                27L,
                6L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Contact",
                "This page contains contact information.",
                "",
                28L,
                6L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "History",
                "The history of our university.",
                "",
                28L,
                6L,
                "",
                false
        ));

        pageService.save(new PageDtoFormCreate(
                "Education",
                "The list of courses we offer.",
                "",
                10L,
                7L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Research",
                "The list of research papers and other academic studies.",
                "",
                10L,
                7L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Business",
                "Services and experts",
                "",
                29L,
                7L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Staff",
                "The list of our staff.",
                "",
                29L,
                7L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Contact",
                "This page contains contact information.",
                "",
                30L,
                7L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "History",
                "The history of our university.",
                "",
                30L,
                7L,
                "",
                false
        ));

        pageService.save(new PageDtoFormCreate(
                "Education",
                "The list of courses we offer.",
                "",
                11L,
                8L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Research",
                "The list of research papers and other academic studies.",
                "",
                11L,
                8L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Business",
                "Services and experts",
                "",
                31L,
                8L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Staff",
                "The list of our staff.",
                "",
                31L,
                8L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Contact",
                "This page contains contact information.",
                "",
                32L,
                8L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "History",
                "The history of our university.",
                "",
                32L,
                8L,
                "",
                false
        ));

        pageService.save(new PageDtoFormCreate(
                "Education",
                "The list of courses we offer.",
                "",
                12L,
                9L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Research",
                "The list of research papers and other academic studies.",
                "",
                12L,
                9L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Business",
                "Services and experts",
                "",
                33L,
                9L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Staff",
                "The list of our staff.",
                "",
                33L,
                9L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Contact",
                "This page contains contact information.",
                "",
                34L,
                9L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "History",
                "The history of our university.",
                "",
                34L,
                9L,
                "",
                false
        ));

        pageService.save(new PageDtoFormCreate(
                "Education",
                "The list of courses we offer.",
                "",
                13L,
                10L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Research",
                "The list of research papers and other academic studies.",
                "",
                13L,
                10L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Business",
                "Services and experts",
                "",
                35L,
                10L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Staff",
                "The list of our staff.",
                "",
                35L,
                10L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "Contact",
                "This page contains contact information.",
                "",
                36L,
                10L,
                "",
                false
        ));
        pageService.save(new PageDtoFormCreate(
                "History",
                "The history of our university.",
                "",
                36L,
                10L,
                "",
                false
        ));

        pageService.modifyHiddenField(1L, false);
        pageService.modifyHiddenField(2L, false);
        pageService.modifyHiddenField(3L, false);
        pageService.modifyHiddenField(5L, false);
        pageService.modifyHiddenField(6L, false);
        pageService.modifyHiddenField(8L, false);
        pageService.modifyHiddenField(10L, false);

        templateService.save("UniversityTemplate");
        templateService.modifyContentField(1L, "Template used for university main page.");

        templateService.save("UniversityTemplate2");
        templateService.modifyContentField(2L, "Second template used for university main page.");

        keyWordsService.save("sztuczna inteligencja");
        keyWordsService.save("si");
        keyWordsService.save("artificial intelligence");
        keyWordsService.save("ai");
        keyWordsService.save("politechnika");
        keyWordsService.save("uniwersytet");
        keyWordsService.save("university");
        keyWordsService.save("machine learning");
    }
}
