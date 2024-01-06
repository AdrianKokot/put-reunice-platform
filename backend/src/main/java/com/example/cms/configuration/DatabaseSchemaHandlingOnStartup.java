package com.example.cms.configuration;

public enum DatabaseSchemaHandlingOnStartup {
    /**
     * Hibernate does not perform any automatic database schema generation or validation; this is
     * typically used when the application relies on a pre-existing database schema
     */
    NONE,
    /**
     * Hibernate automatically creates the database schema based on the entity mappings; this includes
     * creating tables, columns, and constraints. WARNING! 'create' sets fresh data in the database,
     * overriding persistent state of the database (all tables are dropped and recreated) The 'create'
     * type database schema handling should be used only during first application run. Once the
     * application is run and Docker Volume created, the value should be set to 'validate' or 'update'
     * to prevent data loss in case application is stopped and run again, connecting to already
     * existing Docker Volume persisting modified data.
     */
    CREATE,
    /**
     * Hibernate automatically updates the database schema based on the entity mappings; this includes
     * adding or modifying tables, columns, and constraints as necessary, however, it will not delete
     * any columns or tables that are no longer needed.
     */
    UPDATE,
    /**
     * Hibernate validates the schema with the entity mappings; if there are any inconsistencies
     * between the schema and the mappings, an exception is thrown
     */
    VALIDATE
}
