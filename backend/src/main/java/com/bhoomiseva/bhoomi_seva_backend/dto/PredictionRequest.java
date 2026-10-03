package com.bhoomiseva.bhoomi_seva_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PredictionRequest {
    private String village;
    private String taluka;
    private String district;
    private String land_type;
    private Double ready_reckoner_rate_rs_sqft;
    private Double latitude;
    private Double longitude;
    private Double land_area_sqft;
    private String land_category;
    private String road_connectivity;
    private Double distance_highway_km;
    private Double distance_city_km;
    private Double distance_school_km;
    private Double distance_hospital;
    private Double distance_market;
}
