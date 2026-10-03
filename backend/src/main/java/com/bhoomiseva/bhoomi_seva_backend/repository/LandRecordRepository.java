package com.bhoomiseva.bhoomi_seva_backend.repository;

import com.bhoomiseva.bhoomi_seva_backend.entity.LandRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LandRecordRepository extends JpaRepository<LandRecord, Long> {

    List<LandRecord> findBySurveyNoContainingIgnoreCase(String surveyNo);

    List<LandRecord> findByVillageIgnoreCase(String village);

    List<LandRecord> findByLandType(String landType);

    @Query("SELECT DISTINCT l.village FROM LandRecord l ORDER BY l.village")
    List<String> findAllVillages();

    @Query("SELECT DISTINCT l.landType FROM LandRecord l ORDER BY l.landType")
    List<String> findAllLandTypes();

    long countByVillage(String village);

    long countByLandType(String landType);
}
