package put.eunice.cms.university;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface UniversityRepository
        extends JpaRepository<University, Long>, JpaSpecificationExecutor<University> {
    boolean existsByNameOrShortName(String name, String shortName);

    boolean existsUniversityById_AndEnrolledUsers_Id(Long id, Long userId);
}
