package com.bhoomiseva.bhoomi_seva_backend.service;

import com.bhoomiseva.bhoomi_seva_backend.entity.*;
import com.bhoomiseva.bhoomi_seva_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserActivityService {

    @Autowired
    private UserLandHistoryRepository historyRepo;

    @Autowired
    private UserDownloadRepository downloadRepo;

    @Autowired
    private UserPredictionRepository predictionRepo;

    @Autowired
    private LandRecordRepository landRecordRepo;

    private static final int MAX_HISTORY = 5;

    @Transactional
    public void addToHistory(Long userId, Long recordId) {
        Optional<UserLandHistory> existing = historyRepo.findByUserIdAndRecordId(userId, recordId);
        if (existing.isPresent()) {
            UserLandHistory h = existing.get();
            h.setViewedAt(java.time.LocalDateTime.now());
            historyRepo.save(h);
            return;
        }

        long count = historyRepo.countByUserId(userId);
        if (count >= MAX_HISTORY) {
            Optional<UserLandHistory> oldest = historyRepo.findFirstByUserIdOrderByViewedAtAsc(userId);
            oldest.ifPresent(historyRepo::delete);
        }

        UserLandHistory h = new UserLandHistory();
        h.setUserId(userId);
        h.setRecordId(recordId);
        historyRepo.save(h);
    }

    public List<LandRecord> getUserLandRecords(Long userId) {
        List<UserLandHistory> history = historyRepo.findByUserIdOrderByViewedAtDesc(userId);
        return history.stream()
                .map(h -> landRecordRepo.findById(h.getRecordId()).orElse(null))
                .filter(r -> r != null)
                .toList();
    }

    public UserDownload addDownload(Long userId, Long recordId, String documentType, String surveyNo, String village) {
        UserDownload d = new UserDownload();
        d.setUserId(userId);
        d.setRecordId(recordId);
        d.setDocumentType(documentType);
        d.setSurveyNo(surveyNo);
        d.setVillage(village);
        return downloadRepo.save(d);
    }

    public List<UserDownload> getUserDownloads(Long userId) {
        return downloadRepo.findByUserIdOrderByDownloadedAtDesc(userId);
    }

    public UserPrediction addPrediction(UserPrediction prediction) {
        return predictionRepo.save(prediction);
    }

    public List<UserPrediction> getUserPredictions(Long userId) {
        return predictionRepo.findByUserIdOrderByPredictionDateDesc(userId);
    }

    // ==========================
    // REAL DASHBOARD STATS
    // ==========================
    public Map<String, Object> getDashboardStats(Long userId) {
        Map<String, Object> stats = new HashMap<>();

        List<LandRecord> viewedRecords = getUserLandRecords(userId);
        
        // Count by land type
        long satbaraCount = viewedRecords.stream()
                .filter(r -> "Agricultural Plot".equals(r.getLandType()))
                .count();
        long propertyCount = viewedRecords.stream()
                .filter(r -> !"Agricultural Plot".equals(r.getLandType()))
                .count();
        
        // Count predictions
        long predictionCount = predictionRepo.findByUserIdOrderByPredictionDateDesc(userId).size();
        
        // Count downloads
        long downloadCount = downloadRepo.findByUserIdOrderByDownloadedAtDesc(userId).size();

        stats.put("totalRecords", viewedRecords.size());
        stats.put("satbaraCount", satbaraCount); // 7/12 (Agricultural)
        stats.put("eightACount", satbaraCount);  // 8A same as 7/12
        stats.put("propertyCardCount", propertyCount);
        stats.put("predictionCount", predictionCount);
        stats.put("downloadCount", downloadCount);
        stats.put("recentRecords", viewedRecords.stream().limit(3).toList());
        
        return stats;
    }
}