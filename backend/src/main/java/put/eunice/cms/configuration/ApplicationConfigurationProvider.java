package put.eunice.cms.configuration;

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
    private final DatabaseSchemaHandlingOnStartup databaseSchemaHandlingOnStartup;
    private final DatabaseSchemaCreateType databaseSchemaCreateType;
    private final String typesenseApiKey;
    private final String typesenseHost;
    private final Path uploadsDirectory;
    private final Path backupsDirectory;
    private final Path emailTemplatesDirectory;
    private final boolean typesenseCacheEnabled;
    private final int typesenseCacheTtl;
    private final boolean typesenseEmbeddingsEnabled;
    private final float typesenseEmbeddingsDistanceThreshold;

    /**
     * Constructs this application configuration provider.
     *
     * @param applicationServer injected address of application server
     * @param databaseSchemaHandlingOnStartup injected database schema handling strategy to be used on
     *     application startup
     */
    @Autowired
    public ApplicationConfigurationProvider(
            @Value("${app.url}") String applicationServer,
            @Value("${app.database.schema.handling-on-startup}")
                    DatabaseSchemaHandlingOnStartup databaseSchemaHandlingOnStartup,
            @Value("${app.database.schema.create-type}")
                    DatabaseSchemaCreateType databaseSchemaCreateType,
            @Value("${app.typesense.key}") String typesenseApiKey,
            @Value("${app.typesense.host}") String typesenseHost,
            @Value("${app.path.uploads}") String uploadsDirectory,
            @Value("${app.path.backups}") String backupsDirectory,
            @Value("${app.path.templates}") String emailTemplatesDirectory,
            @Value("${app.typesense.cache.enabled}") Boolean typesenseCacheEnabled,
            @Value("${app.typesense.cache.ttl}") Integer typesenseCacheTtl,
            @Value("${app.typesense.use_embedding}") Boolean typesenseEnableEmbeddings,
            @Value("${app.typesense.distance_threshold}") float typesenseEmbeddingsDistanceThreshold) {
        this.applicationServer = applicationServer;
        this.databaseSchemaHandlingOnStartup = databaseSchemaHandlingOnStartup;
        this.databaseSchemaCreateType = databaseSchemaCreateType;
        this.typesenseApiKey = typesenseApiKey;
        this.typesenseHost = typesenseHost;
        this.typesenseCacheEnabled = typesenseCacheEnabled;
        this.typesenseCacheTtl = this.typesenseCacheEnabled ? typesenseCacheTtl : 0;
        this.typesenseEmbeddingsEnabled = typesenseEnableEmbeddings;

        this.uploadsDirectory = Path.of(uploadsDirectory).toAbsolutePath().normalize();
        this.backupsDirectory = Path.of(backupsDirectory).toAbsolutePath().normalize();
        this.emailTemplatesDirectory = Path.of(emailTemplatesDirectory).toAbsolutePath().normalize();
        this.typesenseEmbeddingsDistanceThreshold = typesenseEmbeddingsDistanceThreshold;

        System.out.println("** Properties read:");
        System.out.println("** --");
        System.out.println("** applicationServer = " + this.applicationServer);
        System.out.println(
                "** databaseSchemaHandlingOnStartup = " + this.databaseSchemaHandlingOnStartup);
        System.out.println("** databaseSchemaCreateType = " + this.databaseSchemaCreateType);
        System.out.println("** uploadsDirectory = " + this.uploadsDirectory);
        System.out.println("** backupsDirectory = " + this.backupsDirectory);
        System.out.println("** emailTemplateDictionary = " + this.emailTemplatesDirectory);

        System.out.println("** -- Typesense");
        System.out.println("** host = " + this.typesenseHost);
        System.out.println("** cacheEnabled = " + this.typesenseCacheEnabled);
        System.out.println("** embeddingsEnabled = " + this.typesenseEmbeddingsEnabled);
        System.out.println("** distanceThreshold = " + this.typesenseEmbeddingsDistanceThreshold);
        if (this.typesenseCacheEnabled) System.out.println("** cacheTtl = " + this.typesenseCacheTtl);

        System.out.println("** --");
    }
}
