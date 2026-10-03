package com.bhoomiseva.bhoomi_seva_backend.controller;

import com.bhoomiseva.bhoomi_seva_backend.entity.EightARecord;
import com.bhoomiseva.bhoomi_seva_backend.entity.PropertyCardRecord;
import com.bhoomiseva.bhoomi_seva_backend.entity.SatbaraRecord;
import com.bhoomiseva.bhoomi_seva_backend.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    // Get all documents for a record (auto-detect type)
    @GetMapping("/record/{recordId}")
    public ResponseEntity<Map<String, Object>> getDocuments(@PathVariable Long recordId) {
        Map<String, Object> documents = documentService.getDocuments(recordId);
        if (documents.containsKey("error")) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(documents);
    }

    // Get document type
    @GetMapping("/type/{recordId}")
    public ResponseEntity<Map<String, String>> getDocumentType(@PathVariable Long recordId) {
        String type = documentService.getDocumentType(recordId);
        return ResponseEntity.ok(Map.of("documentType", type, "recordId", recordId.toString()));
    }

    // Get 7/12 Satbara
    @GetMapping("/satbara/{recordId}")
    public ResponseEntity<SatbaraRecord> getSatbara(@PathVariable Long recordId) {
        Optional<SatbaraRecord> record = documentService.getSatbara(recordId);
        return record.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get 8A
    @GetMapping("/eight-a/{recordId}")
    public ResponseEntity<EightARecord> getEightA(@PathVariable Long recordId) {
        Optional<EightARecord> record = documentService.getEightA(recordId);
        return record.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get Property Card
    @GetMapping("/property-card/{recordId}")
    public ResponseEntity<PropertyCardRecord> getPropertyCard(@PathVariable Long recordId) {
        Optional<PropertyCardRecord> record = documentService.getPropertyCard(recordId);
        return record.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Test endpoint
    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> test() {
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Document API is working!"
        ));
    }
}