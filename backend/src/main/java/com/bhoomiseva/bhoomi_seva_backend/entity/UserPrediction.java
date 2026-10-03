package com.bhoomiseva.bhoomi_seva_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_predictions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPrediction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "prediction_id")
    private Long predictionId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "survey_no")
    private String surveyNo;

    @Column(name = "village")
    private String village;

    @Column(name = "land_type")
    private String landType;

    @Column(name = "land_area")
    private BigDecimal landArea;

    @Column(name = "predicted_value")
    private BigDecimal predictedValue;

    @Column(name = "confidence")
    private BigDecimal confidence;

    @Column(name = "prediction_date")
    private LocalDateTime predictionDate;

    @PrePersist
    protected void onCreate() {
        this.predictionDate = LocalDateTime.now();
    }
}