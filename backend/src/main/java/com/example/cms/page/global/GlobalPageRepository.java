package com.example.cms.page.global;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GlobalPageRepository
        extends JpaRepository<GlobalPage, Long>, JpaSpecificationExecutor<GlobalPage> {
    Optional<GlobalPage> findByIsLandingTrue();
}
