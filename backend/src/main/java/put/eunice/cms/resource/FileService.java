package put.eunice.cms.resource;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import put.eunice.cms.configuration.ApplicationConfigurationProvider;

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

    public void renameDirectory(String sourceDirectory, String targetDirectory) throws IOException {
        Path sourcePath = this.config.getUploadsDirectory().resolve(sourceDirectory);
        Path targetPath = this.config.getUploadsDirectory().resolve(targetDirectory);

        if (Files.exists(sourcePath)) {
            Files.move(sourcePath, targetPath, StandardCopyOption.REPLACE_EXISTING);
        }
    }
}
