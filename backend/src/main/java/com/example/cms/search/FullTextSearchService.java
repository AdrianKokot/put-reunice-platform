package com.example.cms.search;

import com.example.cms.configuration.ApplicationConfigurationProvider;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.typesense.api.Client;
import org.typesense.api.Configuration;
import org.typesense.resources.Node;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Log
@Component
public abstract class FullTextSearchService {
    protected final ApplicationConfigurationProvider applicationConfigurationProvider;

    protected final Client client;

    public FullTextSearchService(ApplicationConfigurationProvider applicationConfigurationProvider) {
        this.applicationConfigurationProvider = applicationConfigurationProvider;
        this.client = getClient();
    }

    private Client getClient() {
        List<Node> nodes = new ArrayList<>();

        nodes.add(
                new Node("http", "localhost", "8108")
        );

        Configuration configuration = new Configuration(nodes, Duration.ofSeconds(2), applicationConfigurationProvider.getTypesenseApiKey());

        Client client = new Client(configuration);

        try {
            log.info(client.health.retrieve().toString());
        } catch (Exception e) {
            log.log(java.util.logging.Level.SEVERE, "Error while connecting to Typesense", e);
        }

        return client;
    }
}
