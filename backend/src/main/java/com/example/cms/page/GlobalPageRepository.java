package com.example.cms.page;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface GlobalPageRepository
        extends JpaRepository<GlobalPage, Long>, JpaSpecificationExecutor<GlobalPage> {}
