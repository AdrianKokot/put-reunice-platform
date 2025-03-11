package put.eunice.cms.search.services;

import lombok.extern.java.Log;
import net.htmlparser.jericho.Source;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.typesense.api.FieldTypes;
import org.typesense.api.exceptions.RequestMalformed;
import org.typesense.model.*;
import put.eunice.cms.configuration.ApplicationConfigurationProvider;
import put.eunice.cms.configuration.DatabaseSchemaHandlingOnStartup;
import put.eunice.cms.page.Page;
import put.eunice.cms.search.FullTextSearchService;
import put.eunice.cms.search.projections.PageSearchHitDto;
import put.eunice.cms.university.University;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Log
@Profile("postgres")
public class PageFullTextSearchService extends BaseFullTextSearchService
        implements FullTextSearchService<Page, PageSearchHitDto> {
    private static final String COLLECTION_NAME = "eunice_pages";

    public PageFullTextSearchService(
            @Autowired ApplicationConfigurationProvider applicationConfigurationProvider) {
        super(applicationConfigurationProvider);
        createCollection();
    }

    public void upsert(Page page) {
        if (!isConnected()) return;

        try {
            client.collections(COLLECTION_NAME).documents().upsert(pageToMap(page));
        } catch (Exception e) {
            log.log(java.util.logging.Level.SEVERE, "Error while upserting document", e);
        }
    }

    public void upsert(Collection<Page> pages) {
        if (!isConnected()) return;

        try {
            client
                    .collections(COLLECTION_NAME)
                    .documents()
                    .import_(
                            pages.stream().map(this::pageToMap).collect(Collectors.toList()),
                            new ImportDocumentsParameters().action(IndexAction.UPSERT));
        } catch (Exception e) {
            log.log(java.util.logging.Level.SEVERE, "Error while upserting document collection", e);
        }
    }

    public void delete(Page page) {
        if (!isConnected()) return;

        try {
            client.collections(COLLECTION_NAME).documents(page.getId().toString()).delete();
        } catch (Exception e) {
            log.log(java.util.logging.Level.SEVERE, "Error while deleting document", e);
        }
    }

    public List<PageSearchHitDto> search(String query) {
        SearchParameters searchParameters =
                new SearchParameters()
                        .q(query);

        if (this.applicationConfigurationProvider.isTypesenseEmbeddingsEnabled()) {
            searchParameters = searchParameters
                    .queryBy("title,description,content,creator,university,embedding")
                    .queryByWeights("1,2,2,1,1,5")
                    .vectorQuery(String.format("embedding:([], distance_threshold:%f)",
                            this.applicationConfigurationProvider.getTypesenseEmbeddingsDistanceThreshold()))
                    .excludeFields("content,embedding");
        } else {
            searchParameters = searchParameters
                    .queryBy("title,description,content,creator,university")
                    .queryByWeights("1,2,2,1,1")
                    .excludeFields("content");
        }

        searchParameters = searchParameters
                .perPage(10)
                .highlightFields("title,description")
                .useCache(this.applicationConfigurationProvider.isTypesenseCacheEnabled())
                .cacheTtl(this.applicationConfigurationProvider.getTypesenseCacheTtl())
                .filterBy("hidden:=false");

        List<SearchResultHit> list = List.of();

        try {
            SearchResult searchResult =
                    client.collections(COLLECTION_NAME).documents().search(searchParameters);

            list = searchResult.getHits();
        } catch (RequestMalformed e) {
            log.log(java.util.logging.Level.SEVERE, "Error while searching documents. " + e.message);
        } catch (Exception e) {
            log.log(java.util.logging.Level.SEVERE, "Error while searching documents", e);
        }

        return list.stream().map(PageSearchHitDto::from).collect(Collectors.toList());
    }

    public void deleteCollection() {
        if (!isConnected()) return;

        try {
            client.collections(COLLECTION_NAME).delete();
        } catch (Exception e) {
            log.log(java.util.logging.Level.SEVERE, "Error while clearing collection", e);
        }
    }

    public void createCollection() {
        try {
            if (client.collections(COLLECTION_NAME).retrieve() != null) {
                if (this.applicationConfigurationProvider.getDatabaseSchemaHandlingOnStartup()
                    == DatabaseSchemaHandlingOnStartup.CREATE) return;

                client.collections(COLLECTION_NAME).delete();
            }
        } catch (Exception ignored) {
        }

        List<Field> fields = new ArrayList<>();

        fields.add(new Field().name("pageId").type(FieldTypes.INT32));
        fields.add(new Field().name("universityId").type(FieldTypes.INT32));
        fields.add(new Field().name("title").type(FieldTypes.STRING));
        fields.add(new Field().name("description").type(FieldTypes.STRING));
        fields.add(new Field().name("content").type(FieldTypes.STRING));
        fields.add(new Field().name("hidden").type(FieldTypes.BOOL));
        fields.add(new Field().name("creator").type(FieldTypes.STRING));
        fields.add(new Field().name("university").type(FieldTypes.STRING));
        fields.add(new Field().name("universityName").type(FieldTypes.STRING));

        if (this.applicationConfigurationProvider.isTypesenseEmbeddingsEnabled()) {
            fields.add(
                    new Field()
                            .name("embedding")
                            .type(FieldTypes.FLOAT_ARRAY)
                            .embed(
                                    new FieldEmbed()
                                            .from(List.of("title", "description", "content"))
                                            .modelConfig(
                                                    new FieldEmbedModelConfig()
                                                            .modelName("ts/all-MiniLM-L12-v2")
                                            )
                            )
            );
        }

        CollectionSchema collectionSchema = new CollectionSchema();
        collectionSchema.name(COLLECTION_NAME).fields(fields);

        try {
            client.collections().create(collectionSchema);
            log.info("** Created \"" + COLLECTION_NAME + "\" collection **");
        } catch (Exception e) {
            log.log(java.util.logging.Level.SEVERE, "Error while creating collection", e);
        }
    }

    private Map<String, Object> pageToMap(Page page) {
        Map<String, Object> map = new HashMap<>();

        University university = page.getUniversity();

        var pageTextContent =
                new Source(page.getContent().getPageContent()).getTextExtractor().toString();

        map.put("id", page.getId().toString());
        map.put("pageId", page.getId());
        map.put("universityId", page.getUniversity().getId());
        map.put("title", page.getTitle());
        map.put("description", page.getDescription());
        map.put("content", pageTextContent);
        map.put("hidden", page.isHidden() || page.getUniversity().isHidden());
        map.put("creator", page.getCreator().getFirstName() + " " + page.getCreator().getLastName());
        map.put(
                "university",
                university.getName()
                + " "
                + university.getShortName()
                + " "
                + university.getAddress()
                + " "
                + university.getDescription());
        map.put("universityName", university.getName());

        return map;
    }
}
