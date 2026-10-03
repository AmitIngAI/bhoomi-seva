package com.bhoomiseva.bhoomi_seva_backend.service;

import com.bhoomiseva.bhoomi_seva_backend.entity.Notification;
import com.bhoomiseva.bhoomi_seva_backend.entity.User;
import com.bhoomiseva.bhoomi_seva_backend.repository.NotificationRepository;
import com.bhoomiseva.bhoomi_seva_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepo;

    @Autowired
    private UserRepository userRepo;

    /**
     * Send notification to ALL citizen users
     */
    public void notifyAllUsers(String title, String message, String type, Long recordId) {
        try {
            List<User> allUsers = userRepo.findAll();
            String enrichedMessage = message;
            if (recordId != null) {
                enrichedMessage = message + " [RECORD_ID:" + recordId + "]";
            }
            for (User u : allUsers) {
                if (u.getRole() == User.Role.CITIZEN) {
                    Notification n = Notification.builder()
                            .userId(u.getUserId())
                            .title(title)
                            .message(enrichedMessage)
                            .type(type)
                            .isRead(false)
                            .relatedRecordId(recordId)
                            .build();
                    notificationRepo.save(n);
                }
            }
        } catch (Exception e) {
            System.err.println("Notify all error: " + e.getMessage());
        }
    }

    public void notifyUser(Long userId, String title, String message, String type) {
        try {
            Notification n = Notification.builder()
                    .userId(userId)
                    .title(title)
                    .message(message)
                    .type(type)
                    .isRead(false)
                    .build();
            notificationRepo.save(n);
        } catch (Exception e) {
            System.err.println("Notify user error: " + e.getMessage());
        }
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepo.countByUserIdAndIsRead(userId, false);
    }

    public void markAsRead(Long notificationId) {
        Notification n = notificationRepo.findById(notificationId).orElse(null);
        if (n != null) {
            n.setIsRead(true);
            notificationRepo.save(n);
        }
    }

    public void markAllAsRead(Long userId) {
        List<Notification> all = notificationRepo.findByUserIdOrderByCreatedAtDesc(userId);
        for (Notification n : all) {
            if (!n.getIsRead()) {
                n.setIsRead(true);
                notificationRepo.save(n);
            }
        }
    }

    public void deleteNotification(Long id) {
        notificationRepo.deleteById(id);
    }
}