package com.example.cms.search;

import lombok.extern.java.Log;
import org.springframework.stereotype.Service;
import org.typesense.api.Client;
import org.typesense.api.Configuration;
import org.typesense.resources.Node;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Log
public abstract class FullTextSearchService {
    protected final Client client;

    public FullTextSearchService() {
        List<Node> nodes = new ArrayList<>();
        nodes.add(
                new Node("http", "localhost", "8108")
        );

        Configuration configuration = new Configuration(nodes, Duration.ofSeconds(2), "xyz");

        client = new Client(configuration);

        try {
            log.info(client.health.retrieve().toString());
        } catch (Exception e) {
            log.log(java.util.logging.Level.SEVERE, "Error while connecting to Typesense", e);
        }
    }
}
