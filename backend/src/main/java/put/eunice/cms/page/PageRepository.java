package put.eunice.cms.page;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import put.eunice.cms.resource.FileResource;
import put.eunice.cms.university.University;
import put.eunice.cms.user.User;

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

    @Query(
            value =
                    "SELECT r FROM FileResource r JOIN r.pages p WHERE p.id = :pageId AND SIZE(r.pages) = 1")
    List<FileResource> findResourcesReferencedOnlyByPage(@Param("pageId") Long pageId);

    @Query(
            value =
                    "SELECT count(r) > 0 FROM FileResource r JOIN r.pages p WHERE p.id = :pageId AND SIZE(r.pages) = 1")
    boolean hasPageResourcesReferencedOnlyByItself(@Param("pageId") Long pageId);
}
