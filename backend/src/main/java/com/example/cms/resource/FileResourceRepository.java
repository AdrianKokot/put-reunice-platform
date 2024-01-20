package com.example.cms.resource;

import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface FileResourceRepository
        extends JpaRepository<FileResource, Long>, JpaSpecificationExecutor<FileResource> {

    Long countAllByIdIn(Set<Long> ids);
}
