package com.bhoomiseva.bhoomi_seva_backend.repository;

import com.bhoomiseva.bhoomi_seva_backend.entity.EightARecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EightARepository extends JpaRepository<EightARecord, Long> {
    Optional<EightARecord> findByRecordId(Long recordId);
    Optional<EightARecord> findBySurveyNoAndVillage(String surveyNo, String village);
}