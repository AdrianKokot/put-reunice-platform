package com.example.cms.configuration;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Reads custom application properties from Spring Boot properties file.
 *
 * @author Marcin Szeląg (<a href="mailto:marcin.szelag@cs.put.poznan.pl">marcin.szelag@cs.put.poznan.pl</a>)
 */
@Component
@Getter
public class ApplicationConfigurationProvider {

    private final String applicationServer;
    private final String databaseSchemaHandlingOnStartup;
    private final String databaseSchemaCreateType;
    private final String typesenseApiKey;

    /**
     * Constructs this application configuration provider.
     *
     * @param applicationServer               injected address of application server
     * @param databaseSchemaHandlingOnStartup injected database schema handling strategy to be used on application startup
     */
    @Autowired
    public ApplicationConfigurationProvider(@Value("${applicationServer}") String applicationServer,
                                            @Value("${databaseSchemaHandlingOnStartup}") String databaseSchemaHandlingOnStartup,
                                            @Value("${databaseSchemaCreateType}") String databaseSchemaCreateType,
                                            @Value("${typesenseApiKey}") String typesenseApiKey) {
        this.applicationServer = applicationServer;
        this.databaseSchemaHandlingOnStartup = databaseSchemaHandlingOnStartup;
        this.databaseSchemaCreateType = databaseSchemaCreateType;
        this.typesenseApiKey = typesenseApiKey;

        System.out.println("** Properties read:");
        System.out.println("** --");
        System.out.println("** applicationServer = " + applicationServer);
        System.out.println("** databaseSchemaHandlingOnStartup = " + databaseSchemaHandlingOnStartup);
        System.out.println("** databaseSchemaCreateType = " + databaseSchemaCreateType);
        System.out.println("** --");
    }
}
