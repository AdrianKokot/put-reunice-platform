package com.example.cms.template;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface TemplateRepository
        extends JpaRepository<Template, Long>, JpaSpecificationExecutor<Template> {
    List<Template> findByUniversities_Id(Pageable pageable, Long id);

    Optional<Template> findByName(String name);
}
