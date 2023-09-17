package com.example.cms.page;

import com.example.cms.user.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PageRepository extends JpaRepository<Page, Long>, JpaSpecificationExecutor<Page> {
    boolean existsByParent(Page parent);

    List<Page> findAllByParent(Pageable pageable, Page parent);

    boolean existsByCreator(User creator);

    List<Page> findByCreator(Pageable pageable, User creator);
}
