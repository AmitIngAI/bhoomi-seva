package com.bhoomiseva.bhoomi_seva_backend.service;

import com.bhoomiseva.bhoomi_seva_backend.entity.LandRecord;
import com.bhoomiseva.bhoomi_seva_backend.repository.LandRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LandRecordService {

    @Autowired
    private LandRecordRepository landRecordRepository;

    public List<LandRecord> getAllRecords() {
        return landRecordRepository.findAll();
    }

    public Optional<LandRecord> getRecordById(Long id) {
        return landRecordRepository.findById(id);
    }

    public List<LandRecord> searchBySurveyNo(String surveyNo) {
        return landRecordRepository.findBySurveyNoContainingIgnoreCase(surveyNo);
    }

    public List<LandRecord> searchByVillage(String village) {
        return landRecordRepository.findByVillageIgnoreCase(village);
    }

    public List<LandRecord> searchByLandType(String landType) {
        return landRecordRepository.findByLandType(landType);
    }

    public List<String> getAllVillages() {
        return landRecordRepository.findAllVillages();
    }

    public List<String> getAllLandTypes() {
        return landRecordRepository.findAllLandTypes();
    }

    public long getTotalCount() {
        return landRecordRepository.count();
    }

    public LandRecord saveRecord(LandRecord landRecord) {
        return landRecordRepository.save(landRecord);
    }

    public void deleteRecord(Long id) {
        landRecordRepository.deleteById(id);
    }
}
