package com.bhoomiseva.bhoomi_seva_backend.repository;

import com.bhoomiseva.bhoomi_seva_backend.entity.SatbaraRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SatbaraRepository extends JpaRepository<SatbaraRecord, Long> {
    Optional<SatbaraRecord> findByRecordId(Long recordId);
    Optional<SatbaraRecord> findBySurveyNoAndVillage(String surveyNo, String village);
}