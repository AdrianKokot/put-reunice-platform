package com.example.cms.university;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface UniversityRepository
        extends JpaRepository<University, Long>, JpaSpecificationExecutor<University> {
    boolean existsByNameOrShortName(String name, String shortName);
}
