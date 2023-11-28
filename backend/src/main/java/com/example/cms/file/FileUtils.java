package com.example.cms.file;

import org.springframework.security.core.parameters.P;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.CharacterIterator;
import java.text.StringCharacterIterator;
import java.util.List;
import java.util.Optional;
import java.util.zip.ZipEntry;

public class FileUtils {

    private FileUtils() {

    }

    public static File newFileFromZipEntry(File destinationDir, ZipEntry zipEntry) throws IOException {
        File destFile = new File(destinationDir, zipEntry.getName());

        String destDirPath = destinationDir.getCanonicalPath();
        String destFilePath = destFile.getCanonicalPath();

        if (!destFilePath.startsWith(destDirPath + File.separator)) {
            throw new IOException("Entry is outside of the target dir: " + zipEntry.getName());
        }

        return destFile;
    }

    public static void deleteFiles(List<File> files) throws IOException {
        for (File file : files) {
            Files.delete(Path.of(file.getPath()));
        }
    }

    public static String humanReadableByteCountSI(long bytes) {
        if (-1024 < bytes && bytes < 1024) {
            return bytes + " B";
        }
        CharacterIterator ci = new StringCharacterIterator("kMGTPE");
        while (bytes <= -999_950 || bytes >= 999_950) {
            bytes /= 1024;
            ci.next();
        }
        return String.format("%.1f %cB", bytes / 1024.0, ci.current());
    }

    public static String getFileExtension(MultipartFile file) {
        return getFileExtension(file.getOriginalFilename());
    }

    public static String getFileExtension(File file) {
        return getFileExtension(file.getName());
    }

    public static String getFileExtension(String filename) {
        return Optional.ofNullable(filename).filter(f -> f.contains(".")).map(f -> f.substring(f.lastIndexOf(".") + 1)).orElse("");
    }

    public static Path getSecureFilePath(Path basePath, String filepath) throws IOException {
        return getSecureFilePath(basePath.toString(), filepath);
    }

    public static Path getSecureFilePath(String basePath, String filepath) throws IOException {
        if (filepath.chars().filter(ch -> ch == '.').count() > 1) {
            throw new IOException("File path contains more than one dot: " + filepath);
        }
        if (filepath.contains("//") || filepath.contains("\\\\")) {
            throw new IOException("File path contains more than one slash: " + filepath);
        }

        var normalizedBasePath = Paths.get(basePath).normalize().toAbsolutePath();
        var normalizedFilePath = normalizedBasePath.resolve(filepath).normalize().toAbsolutePath();

        if (normalizedFilePath.startsWith(basePath)) {
            return normalizedFilePath;
        }

        throw new IOException("File path is outside of the target dir: " + normalizedFilePath);
    }
}
