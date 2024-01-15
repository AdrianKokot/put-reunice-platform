package com.example.cms.template;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TemplateRepository
        extends JpaRepository<Template, Long>, JpaSpecificationExecutor<Template> {
    @Query(
            "SELECT distinct t FROM Template t WHERE t.id = :id AND (t.availableToAll = true OR EXISTS (SELECT u FROM University u WHERE u.id IN :ids AND u MEMBER OF t.universities))")
    Optional<Template> findById_available(@Param("id") Long id, @Param("ids") Iterable<Long> ids);

    @Query("SELECT distinct t FROM Template t LEFT JOIN FETCH t.universities WHERE t.id IN :ids")
    List<Template> findAllById_withUniversities(Iterable<Long> ids);
}
