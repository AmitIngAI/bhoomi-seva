package com.bhoomiseva.bhoomi_seva_backend.controller;

import com.bhoomiseva.bhoomi_seva_backend.entity.*;
import com.bhoomiseva.bhoomi_seva_backend.service.UserActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user-activity")
@CrossOrigin(origins = "*")
public class UserActivityController {

    @Autowired
    private UserActivityService activityService;

    @PostMapping("/history/{userId}/{recordId}")
    public ResponseEntity<Map<String, String>> addHistory(@PathVariable Long userId, @PathVariable Long recordId) {
        activityService.addToHistory(userId, recordId);
        return ResponseEntity.ok(Map.of("status", "success"));
    }

    @GetMapping("/my-lands/{userId}")
    public ResponseEntity<List<LandRecord>> getMyLands(@PathVariable Long userId) {
        return ResponseEntity.ok(activityService.getUserLandRecords(userId));
    }

    @PostMapping("/download")
    public ResponseEntity<UserDownload> addDownload(@RequestBody Map<String, Object> body) {
        Long userId = Long.valueOf(body.get("userId").toString());
        Long recordId = Long.valueOf(body.get("recordId").toString());
        String docType = (String) body.get("documentType");
        String surveyNo = (String) body.get("surveyNo");
        String village = (String) body.get("village");
        return ResponseEntity.ok(activityService.addDownload(userId, recordId, docType, surveyNo, village));
    }

    @GetMapping("/downloads/{userId}")
    public ResponseEntity<List<UserDownload>> getDownloads(@PathVariable Long userId) {
        return ResponseEntity.ok(activityService.getUserDownloads(userId));
    }

    @PostMapping("/prediction")
    public ResponseEntity<UserPrediction> addPrediction(@RequestBody UserPrediction prediction) {
        return ResponseEntity.ok(activityService.addPrediction(prediction));
    }

    @GetMapping("/predictions/{userId}")
    public ResponseEntity<List<UserPrediction>> getPredictions(@PathVariable Long userId) {
        return ResponseEntity.ok(activityService.getUserPredictions(userId));
    }

       @GetMapping("/dashboard-stats/{userId}")
    public ResponseEntity<Map<String, Object>> getDashboardStats(@PathVariable Long userId) {
        return ResponseEntity.ok(activityService.getDashboardStats(userId));
    }

}