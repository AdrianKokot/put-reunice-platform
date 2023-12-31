package com.example.cms.file;

import com.example.cms.page.Page;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FileResourceRepository
        extends JpaRepository<FileResource, Long>, JpaSpecificationExecutor<FileResource> {
    Optional<FileResource> findFileResourceByFilenameAndPage(String filename, Page page);

    void deleteFileResourceByFilenameAndAndPage(String filename, Page page);

    @Query(
            value =
                    "SELECT fileResource.filename, fileResource.file_type, fileResource.file_size, fileResource.upload_date, fileResource.uploaded_by FROM files AS fileResource WHERE fileResource.page_id = ?1",
            nativeQuery = true)
    List<Object[]> findAllByPage(Long pageId);
}
