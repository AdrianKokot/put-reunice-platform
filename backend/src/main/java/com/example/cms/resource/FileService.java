package com.example.cms.resource;

import com.example.cms.configuration.ApplicationConfigurationProvider;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class FileService {
    private final ApplicationConfigurationProvider config;

    public String store(MultipartFile file, String filename) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("Failed to store empty file.");
        }

        var fileDestination = FileUtils.getSecureFilePath(this.config.getUploadsDirectory(), filename);

        try (var inputStream = file.getInputStream()) {
            Files.copy(inputStream, fileDestination, StandardCopyOption.REPLACE_EXISTING);
        }

        return "/static/" + fileDestination.getFileName().toString();
    }

    public Path store(MultipartFile file, String filename, String directory) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("Failed to store empty file.");
        }

        var fileDestination =
                FileUtils.getSecureFilePath(this.config.getUploadsDirectory().resolve(directory), filename);

        if (!Files.exists(fileDestination.getParent())) {
            Files.createDirectories(fileDestination.getParent());
        }

        try (var inputStream = file.getInputStream()) {
            Files.copy(inputStream, fileDestination, StandardCopyOption.REPLACE_EXISTING);
        }

        return fileDestination;
    }

    public void deleteDirectory(String directory) throws IOException {
        org.apache.commons.io.FileUtils.deleteDirectory(
                this.config.getUploadsDirectory().resolve(directory).toFile());
    }
}
