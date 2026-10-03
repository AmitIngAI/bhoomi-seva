package com.bhoomiseva.bhoomi_seva_backend.controller;

import com.bhoomiseva.bhoomi_seva_backend.entity.LandRecord;
import com.bhoomiseva.bhoomi_seva_backend.service.LandRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/land-records")
@CrossOrigin(origins = "*")
public class LandRecordController {

    @Autowired
    private LandRecordService landRecordService;

    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> test() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Bhoomi Seva Backend is running!");
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<LandRecord>> getAllRecords() {
        return ResponseEntity.ok(landRecordService.getAllRecords());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LandRecord> getRecordById(@PathVariable Long id) {
        Optional<LandRecord> record = landRecordService.getRecordById(id);
        return record.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/search/survey/{surveyNo}")
    public ResponseEntity<List<LandRecord>> searchBySurveyNo(@PathVariable String surveyNo) {
        return ResponseEntity.ok(landRecordService.searchBySurveyNo(surveyNo));
    }

    @GetMapping("/search/village/{village}")
    public ResponseEntity<List<LandRecord>> searchByVillage(@PathVariable String village) {
        return ResponseEntity.ok(landRecordService.searchByVillage(village));
    }

    @GetMapping("/search/land-type/{landType}")
    public ResponseEntity<List<LandRecord>> searchByLandType(@PathVariable String landType) {
        return ResponseEntity.ok(landRecordService.searchByLandType(landType));
    }

    @GetMapping("/villages")
    public ResponseEntity<List<String>> getAllVillages() {
        return ResponseEntity.ok(landRecordService.getAllVillages());
    }

    @GetMapping("/land-types")
    public ResponseEntity<List<String>> getAllLandTypes() {
        return ResponseEntity.ok(landRecordService.getAllLandTypes());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRecords", landRecordService.getTotalCount());
        stats.put("totalVillages", landRecordService.getAllVillages().size());
        stats.put("totalLandTypes", landRecordService.getAllLandTypes().size());
        stats.put("villages", landRecordService.getAllVillages());
        stats.put("landTypes", landRecordService.getAllLandTypes());
        return ResponseEntity.ok(stats);
    }

    @PostMapping
    public ResponseEntity<LandRecord> createRecord(@RequestBody LandRecord landRecord) {
        return ResponseEntity.ok(landRecordService.saveRecord(landRecord));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteRecord(@PathVariable Long id) {
        landRecordService.deleteRecord(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Record deleted successfully");
        return ResponseEntity.ok(response);
    }
}
