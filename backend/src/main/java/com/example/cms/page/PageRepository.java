package com.example.cms.page;

import com.example.cms.university.University;
import com.example.cms.user.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PageRepository extends JpaRepository<Page, Long>, JpaSpecificationExecutor<Page> {
    boolean existsByParent(Page parent);

    List<Page> findAllByParentAndHiddenFalseAndUniversityHiddenFalse(Pageable pageable, Page parent);

    boolean existsByCreator(User creator);

    List<Page> findByCreator(Pageable pageable, User creator);

    @Query(value = "SELECT p FROM Page p JOIN FETCH p.content WHERE p.university = ?1")
    List<Page> findAllByUniversityAndJoinLazyResources(University university);

    @Query(value = "SELECT p FROM Page p JOIN FETCH p.content WHERE p.id = ?1")
    Optional<Page> findDetailedById(Long id);
}
