package com.bhoomiseva.bhoomi_seva_backend.service;

import com.bhoomiseva.bhoomi_seva_backend.entity.EightARecord;
import com.bhoomiseva.bhoomi_seva_backend.entity.LandRecord;
import com.bhoomiseva.bhoomi_seva_backend.entity.PropertyCardRecord;
import com.bhoomiseva.bhoomi_seva_backend.entity.SatbaraRecord;
import com.bhoomiseva.bhoomi_seva_backend.repository.EightARepository;
import com.bhoomiseva.bhoomi_seva_backend.repository.LandRecordRepository;
import com.bhoomiseva.bhoomi_seva_backend.repository.PropertyCardRepository;
import com.bhoomiseva.bhoomi_seva_backend.repository.SatbaraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class DocumentService {

    @Autowired
    private LandRecordRepository landRecordRepository;

    @Autowired
    private SatbaraRepository satbaraRepository;

    @Autowired
    private EightARepository eightARepository;

    @Autowired
    private PropertyCardRepository propertyCardRepository;

    // Get document type based on land type
    public String getDocumentType(Long recordId) {
        Optional<LandRecord> record = landRecordRepository.findById(recordId);
        if (record.isEmpty()) return "NONE";
        
        String landType = record.get().getLandType();
        if ("Agricultural Plot".equals(landType)) return "AGRICULTURAL";
        return "PROPERTY_CARD";
    }

    // Get all documents for a record
    public Map<String, Object> getDocuments(Long recordId) {
        Map<String, Object> result = new HashMap<>();
        
        Optional<LandRecord> landRecord = landRecordRepository.findById(recordId);
        if (landRecord.isEmpty()) {
            result.put("error", "Record not found");
            return result;
        }
        
        LandRecord lr = landRecord.get();
        result.put("landRecord", lr);
        result.put("landType", lr.getLandType());
        
        if ("Agricultural Plot".equals(lr.getLandType())) {
            result.put("documentType", "AGRICULTURAL");
            satbaraRepository.findByRecordId(recordId)
                    .ifPresent(s -> result.put("satbara", s));
            eightARepository.findByRecordId(recordId)
                    .ifPresent(e -> result.put("eightA", e));
        } else {
            result.put("documentType", "PROPERTY_CARD");
            propertyCardRepository.findByRecordId(recordId)
                    .ifPresent(p -> result.put("propertyCard", p));
        }
        
        return result;
    }

    // Get Satbara by record ID
    public Optional<SatbaraRecord> getSatbara(Long recordId) {
        return satbaraRepository.findByRecordId(recordId);
    }

    // Get 8A by record ID
    public Optional<EightARecord> getEightA(Long recordId) {
        return eightARepository.findByRecordId(recordId);
    }

    // Get Property Card by record ID
    public Optional<PropertyCardRecord> getPropertyCard(Long recordId) {
        return propertyCardRepository.findByRecordId(recordId);
    }
}