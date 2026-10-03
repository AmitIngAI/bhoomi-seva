package com.bhoomiseva.bhoomi_seva_backend.repository;

import com.bhoomiseva.bhoomi_seva_backend.entity.PropertyCardRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PropertyCardRepository extends JpaRepository<PropertyCardRecord, Long> {
    Optional<PropertyCardRecord> findByRecordId(Long recordId);
    Optional<PropertyCardRecord> findBySurveyNoAndVillage(String surveyNo, String village);
}