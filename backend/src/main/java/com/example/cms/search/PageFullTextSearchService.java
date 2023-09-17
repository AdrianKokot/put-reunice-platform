package com.example.cms.search;

import com.example.cms.page.Page;
import com.example.cms.search.projections.PageSearchHitDto;
import com.example.cms.university.University;
import lombok.extern.java.Log;
import org.springframework.stereotype.Service;
import org.typesense.api.FieldTypes;
import org.typesense.api.exceptions.RequestMalformed;
import org.typesense.model.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Log
@Service
public class PageFullTextSearchService extends FullTextSearchService {
    private static final String COLLECTION_NAME = "pages";

    public PageFullTextSearchService() {
        createCollection();
    }

    public void upsert(Page page) {
        try {
            client.collections("pages").documents()
                    .upsert(pageToMap(page));
        } catch (Exception e) {
            log.log(java.util.logging.Level.SEVERE, "Error while upserting document", e);
        }
    }

    public void delete(Page page) {
        try {
            client.collections("pages").documents(page.getId().toString())
                    .delete();
        } catch (Exception e) {
            log.log(java.util.logging.Level.SEVERE, "Error while deleting document", e);
        }
    }

    public List<PageSearchHitDto> search(String query) {
        SearchParameters searchParameters = new SearchParameters()
                .q(query)
                .queryBy("title,description,content,creator,university")
                .maxCandidates(10)
                .filterBy("hidden:=false");

        List<SearchResultHit> list = List.of();

        try {
            SearchResult searchResult = client.collections(COLLECTION_NAME).documents().search(searchParameters);

            list = searchResult.getHits();
        } catch (RequestMalformed e) {
            log.log(java.util.logging.Level.SEVERE, "Error while searching documents. " + e.message);
        } catch (Exception e) {
            log.log(java.util.logging.Level.SEVERE, "Error while searching documents", e);
        }

        return list.stream().map(PageSearchHitDto::from).collect(Collectors.toList());
    }

    private void createCollection() {
        try {
            if (client.collections(COLLECTION_NAME).retrieve() != null)
                return;

        } catch (Exception e) {
            log.log(java.util.logging.Level.SEVERE, "Error while retrieving collection", e);
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

        map.put("pageId", page.getId());
        map.put("universityId", page.getUniversity().getId());
        map.put("title", page.getTitle());
        map.put("description", page.getDescription());
        map.put("content", page.getContent().getPageContent());
        map.put("hidden", page.isHidden() || page.getUniversity().isHidden());
        map.put("creator", page.getCreator().getFirstName() + " " + page.getCreator().getLastName());
        map.put("university", university.getName() +
                " " +
                university.getShortName() +
                " " +
                university.getAddress() +
                " " +
                university.getDescription());
        map.put("universityName", university.getName());

        return map;
    }
}
