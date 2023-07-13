package com.example.cms.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Reads custom application properties from Spring Boot properties file.
 * 
 * @author Marcin Szeląg (<a href="mailto:marcin.szelag@cs.put.poznan.pl">marcin.szelag@cs.put.poznan.pl</a>)
 */
@Component
public class ApplicationConfigurationProvider {
	
	private String applicationServer;
	private String databaseSchemaHandlingOnStartup;
	private String databaseSchemaCreateType;
	
	/**
	 * Constructs this application configuration provider.
	 *  
	 * @param applicationServer injected address of application server
	 * @param databaseSchemaHandlingOnStartup injected database schema handling strategy to be used on application startup
	 */
	@Autowired
	public ApplicationConfigurationProvider(@Value("${applicationServer}") String applicationServer,
			@Value("${databaseSchemaHandlingOnStartup}") String databaseSchemaHandlingOnStartup,
			@Value("${databaseSchemaCreateType}") String databaseSchemaCreateType) {
		this.applicationServer = applicationServer;
		this.databaseSchemaHandlingOnStartup = databaseSchemaHandlingOnStartup;
		this.databaseSchemaCreateType = databaseSchemaCreateType;
		
		System.out.println("** Properties read:");
		System.out.println("** --");
        System.out.println("** applicationServer = " + applicationServer);
        System.out.println("** databaseSchemaHandlingOnStartup = " + databaseSchemaHandlingOnStartup);
        System.out.println("** databaseSchemaCreateType = " + databaseSchemaCreateType);
        System.out.println("** --");
    }
	
	/**
	 * Gets address of the application server.
	 * 
	 * @return address of the application server
	 */
	public String getApplicationServer() {
		return this.applicationServer;
	}

	/**
	 * Gets type of database schema handling on application startup.
	 * 
	 * @return database schema handling on application startup
	 */
	public String getDatabaseSchemaHandlingOnStartup() {
		return databaseSchemaHandlingOnStartup;
	}

	/**
	 * Gets type of database schema creation.
	 * 
	 * @return type of database schema creation
	 */
	public String getDatabaseSchemaCreateType() {
		return databaseSchemaCreateType;
	}
	
}
