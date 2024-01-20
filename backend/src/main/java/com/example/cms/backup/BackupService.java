package com.example.cms.backup;

import com.example.cms.backup.exceptions.BackupException;
import com.example.cms.backup.exceptions.BackupNotFoundException;
import com.example.cms.configuration.ApplicationConfigurationProvider;
import com.example.cms.page.PageRepository;
import com.example.cms.resource.FileUtils;
import com.example.cms.search.FullTextSearchService;
import com.example.cms.search.projections.PageSearchHitDto;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.postgresql.copy.CopyManager;
import org.postgresql.core.BaseConnection;
import org.springframework.core.io.FileSystemResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceUtils;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@Slf4j
@RequiredArgsConstructor
public class BackupService {
    private static final String LARGE_OBJECT_TABLE = "pg_largeobject";
    private final ApplicationConfigurationProvider config;
    private final JdbcTemplate jdbcTemplate;
    private final EntityManager entityManager;
    private final ZipService zipService;
    private final FullTextSearchService<com.example.cms.page.Page, PageSearchHitDto>
            pageSearchService;
    private final PageRepository pageRepository;

    public Path getRestoreMainPath() {
        return this.config.getBackupsDirectory().resolve("restore").toAbsolutePath();
    }

    public Path getBackupsMainPath() {
        return this.config.getBackupsDirectory().resolve("backups").toAbsolutePath();
    }

    private Connection getConnection() {
        return DataSourceUtils.getConnection(
                Optional.ofNullable(jdbcTemplate.getDataSource()).orElseThrow(BackupException::new));
    }

    private CopyManager createCopyManager(Connection connection) throws SQLException {
        if (!connection.isWrapperFor(BaseConnection.class)) {
            throw new BackupException();
        }

        return new CopyManager(connection.unwrap(BaseConnection.class));
    }

    @Secured("ROLE_ADMIN")
    @Transactional
    @Async
    public void exportBackup(String backupName) throws SQLException, IOException {
        log.info("[BACKUP-EXPORT-JOB][{}] Start exporting backup", backupName);
        Connection connection = getConnection();
        CopyManager copyManager = createCopyManager(connection);

        var backupPath = getBackupPath(backupName);
        Path backupDirectoryPath = backupPath.getParent();
        Files.createDirectories(backupDirectoryPath);
        Files.createDirectories(getRestoreMainPath());

        ResultSet tables =
                connection.getMetaData().getTables(null, "public", "%", new String[] {"TABLE"});
        List<File> files = new ArrayList<>();
        while (tables.next()) {
            String tableName = tables.getString("TABLE_NAME");
            log.info("[BACKUP-EXPORT-JOB][{}] Export table: {}", backupName, tableName);
            File file = backupDirectoryPath.resolve(tableName.concat(".txt")).toFile();
            files.add(file);
            writeTableToFile(file, tableName, copyManager);
        }
        File file = backupDirectoryPath.resolve(LARGE_OBJECT_TABLE.concat(".txt")).toFile();
        files.add(file);
        writeTableToFile(file, LARGE_OBJECT_TABLE, copyManager);

        log.info("[BACKUP-EXPORT-JOB][{}] Start creating zip archive", backupName);
        zipService.zipArchive(files, backupPath);
        FileUtils.deleteFiles(files);
        log.info("[BACKUP-EXPORT-JOB][{}] Finish job", backupName);
    }

    private void writeTableToFile(File file, String table, CopyManager copyManager)
            throws IOException, SQLException {
        try (var writer = new BufferedWriter(new FileWriter(file))) {
            copyManager.copyOut(String.format("COPY %s TO STDOUT", table), writer);
        }
    }

    @Secured("ROLE_ADMIN")
    @Transactional
    public void importBackup(String backupName) throws IOException, SQLException {
        log.info("[BACKUP-IMPORT-JOB][{}] Start importing backup", backupName);
        var zipPath = FileUtils.getSecureFilePath(getRestoreMainPath(), backupName.concat(".zip"));

        zipService.unzipArchive(zipPath);
        Files.delete(zipPath);

        log.info("[BACKUP-IMPORT-JOB][{}] Start importing tables", backupName);

        CopyManager copyManager = createCopyManager(getConnection());

        List<File> files =
                Arrays.stream(
                                Optional.ofNullable(getRestoreMainPath().toFile().listFiles())
                                        .orElseThrow(BackupNotFoundException::new))
                        .filter(File::isFile)
                        .filter(file -> !file.getName().equals(LARGE_OBJECT_TABLE.concat(".txt")))
                        .collect(Collectors.toList());

        List<String> tableNames =
                files.stream().map(FileUtils::getFileExtension).collect(Collectors.toList());

        executeQueryOnTables(tableNames, "ALTER TABLE %s DISABLE TRIGGER ALL");
        executeQueryOnTables(tableNames, "DELETE FROM %s");

        for (int i = 0; i < files.size(); i++) {
            readTableFromFile(files.get(i).getPath(), tableNames.get(i), copyManager);
        }

        entityManager.createNativeQuery("DELETE FROM pg_largeobject").executeUpdate();
        readTableFromFile(
                getRestoreMainPath().resolve(LARGE_OBJECT_TABLE.concat(".txt")).toString(),
                LARGE_OBJECT_TABLE,
                copyManager);

        executeQueryOnTables(tableNames, "ALTER TABLE %s ENABLE TRIGGER ALL");

        Files.delete(getRestoreMainPath().resolve("pg_largeobject.txt"));
        FileUtils.deleteFiles(files);

        log.info("[BACKUP-IMPORT-JOB][{}] Start reindexing search collections", backupName);

        pageSearchService.deleteCollection();
        pageSearchService.createCollection();
        pageRepository.findAll().forEach(pageSearchService::upsert);

        log.info("[BACKUP-IMPORT-JOB][{}] Finish job", backupName);
    }

    private void readTableFromFile(String path, String table, CopyManager copyManager)
            throws IOException, SQLException {
        try (var reader = new BufferedReader(new FileReader(path))) {
            copyManager.copyIn(String.format("COPY %s FROM STDIN", table), reader);
        }
    }

    private void executeQueryOnTables(List<String> tableNames, String query) {
        tableNames.forEach(
                tableName ->
                        entityManager.createNativeQuery(String.format(query, tableName)).executeUpdate());
    }

    @Secured("ROLE_ADMIN")
    public Page<BackupDto> getBackups(Pageable pageable) {
        List<BackupDto> allBackups = getBackups();

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), allBackups.size());
        Sort sort = pageable.getSortOr(Sort.by("id").descending());

        if (sort.isSorted()) {
            allBackups.sort(
                    (o1, o2) -> {
                        int result = 0;

                        for (Sort.Order order : sort) {
                            if (order.getProperty().equals("id")) {
                                result = o1.getId().compareTo(o2.getId());
                            } else if (order.getProperty().equals("size")) {
                                result = o1.getSize().compareTo(o2.getSize());
                            }

                            if (order.getDirection().equals(Sort.Direction.DESC)) {
                                result *= -1;
                            }
                        }
                        return result;
                    });
        }

        return new org.springframework.data.domain.PageImpl<>(
                allBackups.subList(start, end), pageable, allBackups.size());
    }

    @Secured("ROLE_ADMIN")
    public List<BackupDto> getBackups() {
        List<File> files =
                Arrays.stream(
                                Optional.ofNullable(getBackupsMainPath().toFile().listFiles())
                                        .orElseThrow(BackupNotFoundException::new))
                        .filter(File::isDirectory)
                        .collect(Collectors.toList());

        return files.stream()
                .filter(
                        file -> {
                            File[] fileList = Optional.ofNullable(file.listFiles()).orElse(new File[] {});
                            return fileList.length == 1
                                    && fileList[0]
                                            .getName()
                                            .substring(fileList[0].getName().lastIndexOf('.'))
                                            .equals(".zip");
                        })
                .map(File::getName)
                .map(
                        fileName -> {
                            File zipFile =
                                    getBackupsMainPath().resolve(fileName).resolve(fileName.concat(".zip")).toFile();
                            return new BackupDto(fileName, FileUtils.humanReadableByteCountSI(zipFile.length()));
                        })
                .collect(Collectors.toList());
    }

    @Secured("ROLE_ADMIN")
    public FileSystemResource getBackupFile(String backupName) {
        try {
            var path = getBackupPath(backupName);
            return new FileSystemResource(path);
        } catch (IOException e) {
            throw new BackupNotFoundException();
        }
    }

    @Secured("ROLE_ADMIN")
    public void deleteBackupFile(String backupName) {
        try {
            var path = getBackupPath(backupName);
            Files.delete(path);
            Files.delete(path.getParent());
        } catch (IOException e) {
            throw new BackupNotFoundException();
        }
    }

    private Path getBackupPath(String backupName) throws IOException {
        backupName = StringUtils.cleanPath(backupName);

        if (backupName.contains(".")) {
            throw new BackupException();
        }

        return FileUtils.getSecureFilePath(
                getBackupsMainPath(), backupName + "/" + backupName.concat(".zip"));
    }
}
