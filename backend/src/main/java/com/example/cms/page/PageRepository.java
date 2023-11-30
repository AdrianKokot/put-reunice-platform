package com.example.cms.page;

import com.example.cms.user.User;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface PageRepository extends JpaRepository<Page, Long>, JpaSpecificationExecutor<Page> {
    boolean existsByParent(Page parent);

    List<Page> findAllByParent(Pageable pageable, Page parent);

    boolean existsByCreator(User creator);

    List<Page> findByCreator(Pageable pageable, User creator);
}
