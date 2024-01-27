package put.eunice.cms.search.services;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.java.Log;
import org.springframework.stereotype.Component;
import org.typesense.api.Client;
import org.typesense.api.Configuration;
import org.typesense.resources.Node;
import put.eunice.cms.configuration.ApplicationConfigurationProvider;

@Log
@Component
public abstract class BaseFullTextSearchService {
    protected final ApplicationConfigurationProvider applicationConfigurationProvider;

    protected final Client client;
    private Boolean health = false;

    protected Boolean isConnected() {
        return health;
    }

    protected BaseFullTextSearchService(
            ApplicationConfigurationProvider applicationConfigurationProvider) {
        this.applicationConfigurationProvider = applicationConfigurationProvider;
        this.client = getClient();
    }

    private Client getClient() {
        List<Node> nodes = new ArrayList<>();

        nodes.add(new Node("http", applicationConfigurationProvider.getTypesenseHost(), "8108"));

        Configuration configuration =
                new Configuration(
                        nodes, Duration.ofSeconds(2), applicationConfigurationProvider.getTypesenseApiKey());

        Client client = new Client(configuration);

        try {
            log.info(client.health.retrieve().toString());
            this.health = true;
        } catch (Exception e) {
            this.health = false;
            log.log(java.util.logging.Level.SEVERE, "Error while connecting to Typesense", e);
        }

        return client;
    }
}
