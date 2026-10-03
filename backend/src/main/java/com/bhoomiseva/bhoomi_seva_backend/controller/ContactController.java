package com.bhoomiseva.bhoomi_seva_backend.controller;

import com.bhoomiseva.bhoomi_seva_backend.entity.ContactMessage;
import com.bhoomiseva.bhoomi_seva_backend.repository.ContactMessageRepository;
import com.bhoomiseva.bhoomi_seva_backend.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {

    @Autowired
    private ContactMessageRepository contactRepo;

    @Autowired
    private ActivityService activityService;

    // Public: Submit contact form
    @PostMapping
    public ResponseEntity<?> submitContact(@RequestBody Map<String, String> body) {
        try {
            ContactMessage msg = ContactMessage.builder()
                    .name(body.get("name"))
                    .email(body.get("email"))
                    .phone(body.getOrDefault("phone", ""))
                    .subject(body.getOrDefault("subject", "General Inquiry"))
                    .message(body.get("message"))
                    .status("Unread")
                    .createdAt(LocalDateTime.now())
                    .build();

            contactRepo.save(msg);

            activityService.logActivity(
                    "CONTACT_MESSAGE",
                    "New Contact Message",
                    body.get("name") + " sent a message",
                    body.get("name"),
                    null
            );

            return ResponseEntity.ok(Map.of("success", true, "message", "Message sent successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // Admin: Get all messages
    @GetMapping("/admin/all")
    public ResponseEntity<Map<String, Object>> getAllMessages() {
        List<ContactMessage> messages = contactRepo.findAllByOrderByCreatedAtDesc();
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", messages.size());
        stats.put("unread", messages.stream().filter(m -> "Unread".equals(m.getStatus())).count());
        stats.put("replied", messages.stream().filter(m -> "Replied".equals(m.getStatus())).count());
        stats.put("resolved", messages.stream().filter(m -> "Resolved".equals(m.getStatus())).count());

        Map<String, Object> data = new HashMap<>();
        data.put("messages", messages);
        data.put("stats", stats);
        return ResponseEntity.ok(data);
    }

    // Admin: Unread count
    @GetMapping("/admin/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        return ResponseEntity.ok(Map.of("count", contactRepo.countByStatus("Unread")));
    }

    // Admin: Mark as read
    @PutMapping("/admin/{id}/mark-read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        ContactMessage msg = contactRepo.findById(id).orElse(null);
        if (msg == null) return ResponseEntity.badRequest().body(Map.of("message", "Not found"));
        if ("Unread".equals(msg.getStatus())) {
            msg.setStatus("Read");
            contactRepo.save(msg);
        }
        return ResponseEntity.ok(Map.of("message", "Marked as read"));
    }

    // Admin: Reply
    @PutMapping("/admin/{id}/reply")
    public ResponseEntity<?> reply(@PathVariable Long id, @RequestBody Map<String, String> body) {
        ContactMessage msg = contactRepo.findById(id).orElse(null);
        if (msg == null) return ResponseEntity.badRequest().body(Map.of("message", "Not found"));

        String reply = body.get("reply");
        if (reply == null || reply.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Reply cannot be empty"));
        }

        msg.setAdminReply(reply);
        msg.setStatus("Replied");
        msg.setRepliedAt(LocalDateTime.now());
        contactRepo.save(msg);

        activityService.logActivity("MESSAGE_REPLIED", "Message Replied",
                "Replied to " + msg.getName(), "Admin", null);

        return ResponseEntity.ok(Map.of("message", "Reply sent successfully"));
    }

    // Admin: Mark resolved
    @PutMapping("/admin/{id}/resolve")
    public ResponseEntity<?> resolve(@PathVariable Long id) {
        ContactMessage msg = contactRepo.findById(id).orElse(null);
        if (msg == null) return ResponseEntity.badRequest().body(Map.of("message", "Not found"));
        msg.setStatus("Resolved");
        msg.setResolvedAt(LocalDateTime.now());
        contactRepo.save(msg);
        return ResponseEntity.ok(Map.of("message", "Marked as resolved"));
    }

    // Admin: Delete
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        contactRepo.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Deleted"));
    }
}