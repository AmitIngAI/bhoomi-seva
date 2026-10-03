package com.bhoomiseva.bhoomi_seva_backend.controller;

import com.bhoomiseva.bhoomi_seva_backend.entity.*;
import com.bhoomiseva.bhoomi_seva_backend.repository.*;
import com.bhoomiseva.bhoomi_seva_backend.service.ActivityService;
import com.bhoomiseva.bhoomi_seva_backend.service.NotificationService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired private LandRecordRepository landRecordRepo;
    @Autowired private SatbaraRepository satbaraRepo;
    @Autowired private EightARepository eightARepo;
    @Autowired private PropertyCardRepository propertyCardRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private PasswordEncoder passwordEncoder;

    // ✅ For notifications (if you have this feature)
    @Autowired(required = false) private NotificationService notificationService;
    @Autowired(required = false) private ActivityService activityService;

    @PersistenceContext
    private EntityManager entityManager;

    // ==========================
    // DASHBOARD STATS
    // ==========================
    @GetMapping("/dashboard-stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalLandRecords", landRecordRepo.count());
        stats.put("totalSatbara", satbaraRepo.count());
        stats.put("totalEightA", eightARepo.count());
        stats.put("totalPropertyCards", propertyCardRepo.count());
        stats.put("totalUsers", userRepo.count());
        stats.put("totalVillages", landRecordRepo.findAllVillages().size());
        return ResponseEntity.ok(stats);
    }

    // ==========================
    // LAND RECORDS - CRUD
    // ==========================
    @GetMapping("/land-records")
    public ResponseEntity<List<LandRecord>> getAllLandRecords() {
        return ResponseEntity.ok(landRecordRepo.findAll());
    }

    @PostMapping("/land-records")
    public ResponseEntity<?> createLandRecord(@RequestBody LandRecord record) {
        try {
            LandRecord saved = landRecordRepo.save(record);
            
            // Trigger notification if service exists
            if (notificationService != null) {
                notificationService.notifyAllUsers(
                    "🎉 New Land Record Added",
                    "A new land record has been added: Survey No " + saved.getSurveyNo() +
                    " in " + saved.getVillage() + ", " + saved.getTaluka(),
                    "RECORD_ADDED",
                    saved.getRecordId()
                );
            }
            if (activityService != null) {
                activityService.logActivity("RECORD_ADDED", "New Land Record Added",
                    "Survey No: " + saved.getSurveyNo(), "Admin", null);
            }
            
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/land-records/{id}")
    public ResponseEntity<?> updateLandRecord(@PathVariable Long id, @RequestBody LandRecord record) {
        try {
            LandRecord existing = landRecordRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));
            record.setRecordId(id);
            record.setCreatedAt(existing.getCreatedAt());
            LandRecord saved = landRecordRepo.save(record);
            
            if (notificationService != null) {
                notificationService.notifyAllUsers(
                    "📝 Land Record Updated: Survey No " + saved.getSurveyNo(),
                    "The land record for Survey No " + saved.getSurveyNo() + " has been updated.",
                    "RECORD_UPDATED",
                    saved.getRecordId()
                );
            }
            
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/land-records/{id}")
    public ResponseEntity<?> deleteLandRecord(@PathVariable Long id) {
        try {
            LandRecord record = landRecordRepo.findById(id).orElse(null);
            String surveyNo = record != null ? record.getSurveyNo() : "#" + id;
            
            landRecordRepo.deleteById(id);
            
            if (notificationService != null) {
                notificationService.notifyAllUsers(
                    "❌ Land Record Removed",
                    "The land record for Survey No " + surveyNo + " has been removed.",
                    "RECORD_DELETED",
                    null
                );
            }
            
            return ResponseEntity.ok(Map.of("message", "Deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ==========================
    // SATBARA (7/12) - CRUD
    // ==========================
    @GetMapping("/satbara")
    public ResponseEntity<List<SatbaraRecord>> getAllSatbara() {
        return ResponseEntity.ok(satbaraRepo.findAll());
    }

    @PostMapping("/satbara/generate/{recordId}")
    public ResponseEntity<?> generateSatbara(@PathVariable Long recordId, @RequestBody Map<String, Object> body) {
        try {
            LandRecord land = landRecordRepo.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Land record not found"));

            SatbaraRecord satbara = new SatbaraRecord();
            satbara.setRecordId(recordId);
            satbara.setSurveyNo(land.getSurveyNo());
            satbara.setVillage(land.getVillage());
            satbara.setTaluka(land.getTaluka());
            satbara.setDistrict(land.getDistrict());
            satbara.setLandType(land.getLandType());
            satbara.setAreaHectare(land.getLandAreaSqft().divide(new java.math.BigDecimal("107639"), 4, java.math.RoundingMode.HALF_UP));
            satbara.setOwnerName((String) body.getOrDefault("ownerName", "Not Specified"));
            satbara.setOwnerAddress((String) body.getOrDefault("ownerAddress", land.getVillage()));
            satbara.setSheetNo(1);
            satbara.setDocumentId("SAT-" + System.currentTimeMillis());
            satbara.setGeneratedDate(LocalDateTime.now());
            satbara.setGeneratedBy("Admin");
            satbara.setTalathiName("Village Talathi");
            satbara.setVerificationStatus("VERIFIED");

            return ResponseEntity.ok(satbaraRepo.save(satbara));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/satbara/{id}")
    public ResponseEntity<?> deleteSatbara(@PathVariable Long id) {
        try {
            satbaraRepo.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ==========================
    // 8A RECORDS - CRUD
    // ==========================
    @GetMapping("/eight-a")
    public ResponseEntity<List<EightARecord>> getAllEightA() {
        return ResponseEntity.ok(eightARepo.findAll());
    }

    @PostMapping("/eight-a/generate/{recordId}")
    public ResponseEntity<?> generateEightA(@PathVariable Long recordId, @RequestBody Map<String, Object> body) {
        try {
            LandRecord land = landRecordRepo.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Land record not found"));

            EightARecord eightA = new EightARecord();
            eightA.setRecordId(recordId);
            eightA.setSurveyNo(land.getSurveyNo());
            eightA.setVillage(land.getVillage());
            eightA.setTaluka(land.getTaluka());
            eightA.setDistrict(land.getDistrict());
            eightA.setLandType(land.getLandType());
            eightA.setAreaHectare(land.getLandAreaSqft().divide(new java.math.BigDecimal("107639"), 4, java.math.RoundingMode.HALF_UP));
            eightA.setOwner1Name((String) body.getOrDefault("ownerName", "Not Specified"));
            eightA.setOwner1Address((String) body.getOrDefault("ownerAddress", land.getVillage()));
            eightA.setSheetNo(1);
            eightA.setBhoomapanKramank(1);
            eightA.setDocumentId("8A-" + System.currentTimeMillis());
            eightA.setGeneratedDate(LocalDateTime.now());
            eightA.setGeneratedBy("Admin");
            eightA.setTalathiName("Village Talathi");
            eightA.setVerificationStatus("VERIFIED");

            return ResponseEntity.ok(eightARepo.save(eightA));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/eight-a/{id}")
    public ResponseEntity<?> deleteEightA(@PathVariable Long id) {
        try {
            eightARepo.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ==========================
    // PROPERTY CARDS - CRUD
    // ==========================
    @GetMapping("/property-cards")
    public ResponseEntity<List<PropertyCardRecord>> getAllPropertyCards() {
        return ResponseEntity.ok(propertyCardRepo.findAll());
    }

    @PostMapping("/property-cards/generate/{recordId}")
    public ResponseEntity<?> generatePropertyCard(@PathVariable Long recordId, @RequestBody Map<String, Object> body) {
        try {
            LandRecord land = landRecordRepo.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Land record not found"));

            PropertyCardRecord card = new PropertyCardRecord();
            card.setRecordId(recordId);
            card.setSurveyNo(land.getSurveyNo());
            card.setVillage(land.getVillage());
            card.setPropertyId("PC-" + System.currentTimeMillis());
            card.setOwnerName((String) body.getOrDefault("ownerName", "Not Specified"));
            card.setOwnerAddress((String) body.getOrDefault("ownerAddress", land.getVillage()));
            card.setMobileNo((String) body.getOrDefault("mobileNo", ""));
            card.setEmail((String) body.getOrDefault("email", ""));
            card.setAreaSqm(land.getLandAreaSqft().multiply(new java.math.BigDecimal("0.092903")).setScale(2, java.math.RoundingMode.HALF_UP));
            card.setUsageType(land.getLandType());
            card.setDocumentId("PC-" + System.currentTimeMillis());
            card.setGeneratedDate(LocalDateTime.now());
            card.setCorporationName("Municipal Corporation");
            card.setCommissionerName("Commissioner");
            card.setVerificationStatus("VERIFIED");

            return ResponseEntity.ok(propertyCardRepo.save(card));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/property-cards/{id}")
    public ResponseEntity<?> deletePropertyCard(@PathVariable Long id) {
        try {
            propertyCardRepo.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ==========================
    // USERS - MANAGEMENT
    // ==========================
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepo.findAll());
    }

    // ✅ Block User
    @PutMapping("/users/{userId}/block")
    public ResponseEntity<?> blockUser(@PathVariable Long userId) {
        try {
            User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

            if (user.getRole() == User.Role.ADMIN) {
                return ResponseEntity.badRequest().body(Map.of("message", "Cannot block admin users"));
            }

            user.setStatus(User.Status.BLOCKED);
            userRepo.save(user);
            return ResponseEntity.ok(Map.of("message", "User blocked successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ✅ Unblock User
    @PutMapping("/users/{userId}/unblock")
    public ResponseEntity<?> unblockUser(@PathVariable Long userId) {
        try {
            User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

            user.setStatus(User.Status.ACTIVE);
            userRepo.save(user);
            return ResponseEntity.ok(Map.of("message", "User unblocked successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Uses native SQL to bypass any JPA constraints
     */
    @DeleteMapping("/users/{userId}")
    @Transactional
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

            if (user.getRole() == User.Role.ADMIN) {
                return ResponseEntity.badRequest().body(Map.of("message", "Cannot delete admin users"));
            }

            String userName = user.getFullName();
            String userEmail = user.getEmail();

            System.out.println("🗑️ Starting permanent delete for user: " + userName + " (ID: " + userId + ")");

            // Step 1: Delete user downloads
            try {
                int deleted = entityManager
                    .createNativeQuery("DELETE FROM user_downloads WHERE user_id = :uid")
                    .setParameter("uid", userId)
                    .executeUpdate();
                System.out.println("   ✅ Deleted " + deleted + " downloads");
            } catch (Exception e) {
                System.err.println("   Error deleting downloads: " + e.getMessage());
            }

            // Step 2: Delete land history
            try {
                int deleted = entityManager
                    .createNativeQuery("DELETE FROM user_land_history WHERE user_id = :uid")
                    .setParameter("uid", userId)
                    .executeUpdate();
                System.out.println("   ✅ Deleted " + deleted + " land history records");
            } catch (Exception e) {
                System.err.println("   Error deleting land history: " + e.getMessage());
            }

            // Step 3: Delete predictions
            try {
                int deleted = entityManager
                    .createNativeQuery("DELETE FROM user_predictions WHERE user_id = :uid")
                    .setParameter("uid", userId)
                    .executeUpdate();
                System.out.println("   ✅ Deleted " + deleted + " predictions");
            } catch (Exception e) {
                System.err.println("   Error deleting predictions: " + e.getMessage());
            }

            // Step 4: Delete notifications (if table exists)
            try {
                int deleted = entityManager
                    .createNativeQuery("DELETE FROM notifications WHERE user_id = :uid")
                    .setParameter("uid", userId)
                    .executeUpdate();
                System.out.println("   ✅ Deleted " + deleted + " notifications");
            } catch (Exception e) {
                // Table may not exist - silent
            }

            // Step 5: Finally delete the user
            int userDeleted = entityManager
                .createNativeQuery("DELETE FROM users WHERE user_id = :uid")
                .setParameter("uid", userId)
                .executeUpdate();
            System.out.println("   ✅ Deleted user record: " + userDeleted);

            // Clear entity manager cache
            entityManager.flush();
            entityManager.clear();

            System.out.println("✅ User PERMANENTLY DELETED: " + userName + " (" + userEmail + ")");

            return ResponseEntity.ok(Map.of(
                "message", "User " + userName + " deleted permanently along with all related data",
                "success", true
            ));

        } catch (Exception e) {
            System.err.println("❌ Delete error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Failed to delete user: " + e.getMessage(),
                "success", false
            ));
        }
    }

    // ==========================
    // ADMIN SETTINGS
    // ==========================
    @PutMapping("/settings/{userId}")
    public ResponseEntity<?> updateAdminSettings(@PathVariable Long userId, @RequestBody Map<String, String> body) {
        try {
            User admin = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

            if (body.containsKey("fullName") && !body.get("fullName").isEmpty()) {
                admin.setFullName(body.get("fullName"));
            }
            if (body.containsKey("email") && !body.get("email").isEmpty()) {
                admin.setEmail(body.get("email"));
            }
            if (body.containsKey("mobile") && !body.get("mobile").isEmpty()) {
                admin.setMobile(body.get("mobile"));
            }
            if (body.containsKey("newPassword") && !body.get("newPassword").isEmpty()) {
                String oldPassword = body.get("oldPassword");
                if (oldPassword == null || !passwordEncoder.matches(oldPassword, admin.getPassword())) {
                    return ResponseEntity.badRequest().body(Map.of("message", "Old password incorrect"));
                }
                admin.setPassword(passwordEncoder.encode(body.get("newPassword")));
            }

            userRepo.save(admin);
            return ResponseEntity.ok(Map.of("message", "Settings updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Get recent activities (if service exists)
    @GetMapping("/activities")
    public ResponseEntity<?> getActivities() {
        try {
            if (activityService != null) {
                return ResponseEntity.ok(activityService.getRecentActivities());
            }
            return ResponseEntity.ok(new ArrayList<>());
        } catch (Exception e) {
            return ResponseEntity.ok(new ArrayList<>());
        }
    }
}