package com.bhoomiseva.bhoomi_seva_backend.service;

import com.bhoomiseva.bhoomi_seva_backend.entity.Activity;
import com.bhoomiseva.bhoomi_seva_backend.repository.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepo;

    @Transactional
    public void logActivity(String type, String title, String description, String userName, Long userId) {
        try {
            Activity activity = Activity.builder()
                    .activityType(type)
                    .title(title)
                    .description(description)
                    .userName(userName)
                    .userId(userId)
                    .createdAt(LocalDateTime.now())
                    .build();

            activityRepo.save(activity);

            // Keep only latest 5
            List<Activity> all = activityRepo.findAllByOrderByCreatedAtDesc();
            if (all.size() > 5) {
                List<Activity> toDelete = all.subList(5, all.size());
                activityRepo.deleteAll(toDelete);
            }
        } catch (Exception e) {
            System.err.println("Activity log error: " + e.getMessage());
        }
    }

    public List<Activity> getRecentActivities() {
        return activityRepo.findTop5ByOrderByCreatedAtDesc();
    }
}