package com.example.cms.file;

import com.example.cms.configuration.ApplicationConfigurationProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
@RequiredArgsConstructor
public class FileService {
    private Path uploadsDirectory;

    @Autowired
    FileService(ApplicationConfigurationProvider config) {
        this.uploadsDirectory = Paths.get(config.getUploadsDirectory().replace("///", "")).normalize().toAbsolutePath();
    }

    public String store(MultipartFile file, String filename) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("Failed to store empty file.");
        }

        var fileDestination = FileUtils.getSecureFilePath(this.uploadsDirectory, filename);

        try (var inputStream = file.getInputStream()) {
            Files.copy(inputStream, fileDestination, StandardCopyOption.REPLACE_EXISTING);
        }

        return "/static/" + fileDestination.getFileName().toString();
    }
}

