package com.example.cms.configuration;

import java.io.IOException;
import java.nio.file.Path;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

/** Reads custom application properties from Spring Boot properties file. */
@Service
@Component
@Getter
public class ApplicationConfigurationProvider {

    private final String applicationServer;
    private final String databaseSchemaHandlingOnStartup;
    private final String databaseSchemaCreateType;
    private final String typesenseApiKey;
    private final String typesenseHost;
    private final Path uploadsDirectory;
    private final Path backupsDirectory;

    /**
     * Constructs this application configuration provider.
     *
     * @param applicationServer injected address of application server
     * @param databaseSchemaHandlingOnStartup injected database schema handling strategy to be used
     *     on application startup
     */
    @Autowired
    public ApplicationConfigurationProvider(
            @Value("${applicationServer}") String applicationServer,
            @Value("${databaseSchemaHandlingOnStartup}") String databaseSchemaHandlingOnStartup,
            @Value("${databaseSchemaCreateType}") String databaseSchemaCreateType,
            @Value("${typesenseApiKey}") String typesenseApiKey,
            @Value("${typesenseHost}") String typesenseHost,
            @Value("${uploadsDirectory}") String uploadsDirectory,
            @Value("${backupsDirectory}") String backupsDirectory)
            throws IOException {
        this.applicationServer = applicationServer;
        this.databaseSchemaHandlingOnStartup = databaseSchemaHandlingOnStartup;
        this.databaseSchemaCreateType = databaseSchemaCreateType;
        this.typesenseApiKey = typesenseApiKey;
        this.typesenseHost = typesenseHost;

        this.uploadsDirectory = Path.of(uploadsDirectory).toAbsolutePath().normalize();
        this.backupsDirectory = Path.of(backupsDirectory).toAbsolutePath().normalize();

        System.out.println("** Properties read:");
        System.out.println("** --");
        System.out.println("** applicationServer = " + this.applicationServer);
        System.out.println(
                "** databaseSchemaHandlingOnStartup = " + this.databaseSchemaHandlingOnStartup);
        System.out.println("** databaseSchemaCreateType = " + this.databaseSchemaCreateType);
        System.out.println("** uploadsDirectory = " + this.uploadsDirectory);
        System.out.println("** backupsDirectory = " + this.backupsDirectory);
        System.out.println("** --");
    }
}
