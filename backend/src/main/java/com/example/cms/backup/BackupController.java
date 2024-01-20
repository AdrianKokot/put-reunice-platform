package com.example.cms.backup;

import java.io.IOException;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/backups")
@RequiredArgsConstructor
public class BackupController {
    private final BackupService backupService;

    @PostMapping()
    public ResponseEntity<Void> exportDatabaseBackup() throws SQLException, IOException {
        backupService.exportBackup(String.valueOf(Timestamp.valueOf(LocalDateTime.now()).getTime()));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/import/{backupName}")
    public void importDatabaseBackup(@PathVariable String backupName)
            throws SQLException, IOException {
        backupService.importBackup(backupName);
    }

    @GetMapping()
    public ResponseEntity<List<BackupDto>> getBackups(Pageable pageable) {
        org.springframework.data.domain.Page<BackupDto> response = backupService.getBackups(pageable);

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("X-Whole-Content-Length", String.valueOf(response.getTotalElements()));

        return new ResponseEntity<>(
                response.stream().collect(Collectors.toList()), httpHeaders, HttpStatus.OK);
    }

    @GetMapping(value = "/{backupName}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public FileSystemResource downloadBackup(@PathVariable String backupName) {
        return backupService.getBackupFile(StringUtils.cleanPath(backupName));
    }

    @DeleteMapping(value = "/{backupName}")
    public void deleteBackup(@PathVariable String backupName) {
        backupService.deleteBackupFile(backupName);
    }
}
