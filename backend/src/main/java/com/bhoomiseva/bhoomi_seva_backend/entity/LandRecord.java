package com.bhoomiseva.bhoomi_seva_backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "land_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LandRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "record_id")
    private Long recordId;

    @Column(name = "survey_no", nullable = false, length = 20)
    private String surveyNo;

    @Column(name = "village", nullable = false, length = 100)
    private String village;

    @Column(name = "taluka", nullable = false, length = 50)
    private String taluka;

    @Column(name = "district", nullable = false, length = 50)
    private String district;

    @Column(name = "land_type", nullable = false, length = 50)
    private String landType;

    @Column(name = "ready_reckoner_rate_rs_sqft", precision = 15, scale = 2)
    private BigDecimal readyReckonerRateRsSqft;

    @Column(name = "latitude", precision = 10, scale = 6)
    private BigDecimal latitude;

    @Column(name = "longitude", precision = 10, scale = 6)
    private BigDecimal longitude;

    @Column(name = "land_area_sqft", nullable = false, precision = 15, scale = 2)
    private BigDecimal landAreaSqft;

    @Column(name = "land_category", length = 20)
    private String landCategory;

    @Column(name = "road_connectivity", length = 20)
    private String roadConnectivity;

    @Column(name = "distance_highway_km", precision = 6, scale = 2)
    private BigDecimal distanceHighwayKm;

    @Column(name = "distance_city_km", precision = 6, scale = 2)
    private BigDecimal distanceCityKm;

    @Column(name = "distance_school_km", precision = 6, scale = 2)
    private BigDecimal distanceSchoolKm;

    @Column(name = "distance_hospital", precision = 6, scale = 2)
    private BigDecimal distanceHospital;

    @Column(name = "distance_market", precision = 6, scale = 2)
    private BigDecimal distanceMarket;

    @Column(name = "historical_price", precision = 15, scale = 2)
    private BigDecimal historicalPrice;

    @Column(name = "government_rate", precision = 15, scale = 2)
    private BigDecimal governmentRate;

    @Column(name = "sale_price", precision = 15, scale = 2)
    private BigDecimal salePrice;

    @Column(name = "current_market_price", precision = 15, scale = 2)
    private BigDecimal currentMarketPrice;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
