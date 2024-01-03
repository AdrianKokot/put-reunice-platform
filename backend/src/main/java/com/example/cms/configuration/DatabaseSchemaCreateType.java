package com.example.cms.configuration;

/**
 * Additional setup concerning only the case when DATABASE_SCHEMA_HANDLING_ON_STARTUP=create.
 * Possible values: populate|initialize. The meaning of these values is as follows:
 */
public enum DatabaseSchemaCreateType {
    /**
     * database is restored from a zip backup file located in db-resources/restore directory, or, if
     * there is no backup file, it is created from scratch and then initialized with only one user
     * being a system administrator (this enables to input all data later using that administrative
     * account).
     */
    INITIALIZE, // create only main admin so the data can be added manually (e.g., using a frontend
    // application)
    /**
     * database is restored from a zip backup file located in db-resources/restore directory, or, if
     * there is no backup file, it is created from scratch and then initialized with some test (dummy)
     * data;
     */
    POPULATE // insert dummy data to demonstrate the application
}
