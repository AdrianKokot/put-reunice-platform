package com.example.cms.resource;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.CharacterIterator;
import java.text.StringCharacterIterator;
import java.util.List;
import java.util.Optional;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;
import org.springframework.web.multipart.MultipartFile;

public final class FileUtils {
    public static File newFileFromZipEntry(File destinationDir, ZipEntry zipEntry)
            throws IOException {
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
        return Optional.ofNullable(filename)
                .filter(f -> f.contains("."))
                .map(f -> f.substring(f.lastIndexOf(".") + 1))
                .orElse("");
    }

    public static Path getSecureFilePath(Path basePath, String rawFilepath) throws IOException {
        var filepath =
                rawFilepath.replaceAll("\\.(?=.*\\.)", "").replaceAll("//", "").replaceAll("\\\\", "");

        var normalizedBasePath = basePath.toAbsolutePath().normalize();
        var normalizedFilePath = normalizedBasePath.resolve(filepath).toAbsolutePath().normalize();

        if (normalizedFilePath.startsWith(normalizedBasePath)) {
            return normalizedFilePath;
        }

        throw new IOException("File path is outside of the target dir: " + normalizedFilePath);
    }

    public static void zipArchive(List<File> files, Path zipPath) throws IOException {
        try (ZipOutputStream zipOut = new ZipOutputStream(new FileOutputStream(zipPath.toFile()))) {
            for (File file : files) {
                zipFile(file, file.getName(), zipOut);
            }
        }
    }

    private static void zipFile(File fileToZip, String fileName, ZipOutputStream zipOut)
            throws IOException {
        if (fileToZip.isHidden()) {
            return;
        }
        if (fileToZip.isDirectory()) {
            if (fileName.endsWith("/")) {
                zipOut.putNextEntry(new ZipEntry(fileName));
                zipOut.closeEntry();
            } else {
                zipOut.putNextEntry(new ZipEntry(fileName + "/"));
                zipOut.closeEntry();
            }
            File[] children = fileToZip.listFiles();
            for (File childFile : children) {
                zipFile(childFile, fileName + "/" + childFile.getName(), zipOut);
            }
            return;
        }
        FileInputStream fis = new FileInputStream(fileToZip);
        ZipEntry zipEntry = new ZipEntry(fileName);
        zipOut.putNextEntry(zipEntry);
        byte[] bytes = new byte[1024];
        int length;
        while ((length = fis.read(bytes)) >= 0) {
            zipOut.write(bytes, 0, length);
        }
        fis.close();
    }

    public static void unzipArchive(Path zipPath) throws IOException {
        File destDir = zipPath.getParent().toFile();

        try (ZipInputStream zis = new ZipInputStream(new FileInputStream(zipPath.toFile()))) {
            ZipEntry zipEntry = zis.getNextEntry();
            while (zipEntry != null) {
                unzipSingleFile(FileUtils.newFileFromZipEntry(destDir, zipEntry), zipEntry, zis);
                zipEntry = zis.getNextEntry();
            }
            zis.closeEntry();
        }
    }

    private static void unzipSingleFile(File file, ZipEntry zipEntry, ZipInputStream zis)
            throws IOException {
        if (zipEntry.isDirectory()) {
            file.mkdirs();
            return;
        }

        if (!file.getParentFile().exists()) {
            file.getParentFile().mkdirs();
        }

        byte[] buffer = new byte[1024];
        try (FileOutputStream fos = new FileOutputStream(file)) {
            int len;
            while ((len = zis.read(buffer)) > 0) {
                fos.write(buffer, 0, len);
            }
        }
    }
}
