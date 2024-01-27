package put.eunice.cms.resource;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import put.eunice.cms.user.User;

@Repository
public interface FileResourceRepository
        extends JpaRepository<FileResource, Long>, JpaSpecificationExecutor<FileResource> {
    boolean existsByAuthor(User author);
}
