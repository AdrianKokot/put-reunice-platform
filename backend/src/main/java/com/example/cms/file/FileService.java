package com.example.cms.file;

import com.example.cms.configuration.ApplicationConfigurationProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;

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
}

