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

    @Query("from Page where " +
            "(LOWER(title) LIKE :text " +
            "OR LOWER(description) LIKE :text " +
            "OR LOWER(keyWords) LIKE :text) and " +
            "(hidden = false and university.hidden = false)")
    List<Page> searchPages(Pageable pageable, @Param("text") String text);

    @Query("from Page where " +
            "(LOWER(title) LIKE :text " +
            "OR LOWER(description) LIKE :text " +
            "OR LOWER(keyWords) LIKE :text) and " +
            "((hidden = false and university.hidden = false) or " +
            "(:role = 'ADMIN') or" +
            "(:role= 'MODERATOR' and university.id in :universities) or " +
            "(:role = 'USER' and creator.id = :creator))")
    List<Page> searchPages(Pageable pageable,
                           @Param("text") String text,
                           @Param("role") String accountType,
                           @Param("universities") List<Long> universities,
                           @Param("creator") Long creator);

    boolean existsByCreator(User creator);

    List<Page> findByCreator(Pageable pageable, User creator);
}
