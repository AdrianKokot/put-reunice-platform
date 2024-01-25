package com.example.cms.resource;

import com.example.cms.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface FileResourceRepository
        extends JpaRepository<FileResource, Long>, JpaSpecificationExecutor<FileResource> {
    boolean existsByAuthor(User author);
}
