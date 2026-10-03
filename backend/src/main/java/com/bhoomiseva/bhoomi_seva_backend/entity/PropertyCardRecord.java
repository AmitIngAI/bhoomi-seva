package com.bhoomiseva.bhoomi_seva_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "property_card_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropertyCardRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "property_card_id")
    private Long propertyCardId;

    @Column(name = "record_id")
    private Long recordId;

    @Column(name = "property_id")
    private String propertyId;

    @Column(name = "owner_name")
    private String ownerName;

    @Column(name = "authorized_person")
    private String authorizedPerson;

    @Column(name = "owner_address")
    private String ownerAddress;

    @Column(name = "mobile_no")
    private String mobileNo;

    @Column(name = "email")
    private String email;

    @Column(name = "property_no")
    private Integer propertyNo;

    @Column(name = "village")
    private String village;

    @Column(name = "ward")
    private String ward;

    @Column(name = "ward_no")
    private Integer wardNo;

    @Column(name = "area_sqm")
    private BigDecimal areaSqm;

    @Column(name = "survey_no")
    private String surveyNo;

    @Column(name = "hissa_no")
    private Integer hissaNo;

    @Column(name = "gat_no")
    private String gatNo;

    @Column(name = "tps_no")
    private Integer tpsNo;

    @Column(name = "plot_no")
    private Integer plotNo;

    @Column(name = "usage_type")
    private String usageType;

    @Column(name = "property_type")
    private String propertyType;

    @Column(name = "building_type")
    private String buildingType;

    @Column(name = "business_type")
    private String businessType;

    @Column(name = "building_status")
    private String buildingStatus;

    @Column(name = "approval_no")
    private String approvalNo;

    @Column(name = "approval_date")
    private String approvalDate;

    @Column(name = "commencement_no")
    private String commencementNo;

    @Column(name = "commencement_date")
    private String commencementDate;

    @Column(name = "completion_no")
    private String completionNo;

    @Column(name = "completion_date")
    private String completionDate;

    @Column(name = "year_of_construction")
    private String yearOfConstruction;

    @Column(name = "no_of_floors")
    private String noOfFloors;

    @Column(name = "built_up_area")
    private BigDecimal builtUpArea;

    @Column(name = "carpet_area")
    private BigDecimal carpetArea;

    @Column(name = "plot_area")
    private BigDecimal plotArea;

    @Column(name = "open_area")
    private BigDecimal openArea;

    @Column(name = "wall_type")
    private String wallType;

    @Column(name = "roof_type")
    private String roofType;

    @Column(name = "staircase_type")
    private String staircaseType;

    @Column(name = "lift_facility")
    private String liftFacility;

    @Column(name = "land_use")
    private String landUse;

    @Column(name = "assessment_date")
    private String assessmentDate;

    @Column(name = "annual_value")
    private BigDecimal annualValue;

    @Column(name = "rateable_value")
    private BigDecimal rateableValue;

    @Column(name = "tax_rate")
    private BigDecimal taxRate;

    @Column(name = "property_tax")
    private BigDecimal propertyTax;

    @Column(name = "water_tax")
    private BigDecimal waterTax;

    @Column(name = "sanitation_tax")
    private BigDecimal sanitationTax;

    @Column(name = "fire_tax")
    private BigDecimal fireTax;

    @Column(name = "total_tax")
    private BigDecimal totalTax;

    @Column(name = "tax_year1")
    private String taxYear1;

    @Column(name = "tax_year1_property")
    private BigDecimal taxYear1Property;

    @Column(name = "tax_year1_water")
    private BigDecimal taxYear1Water;

    @Column(name = "tax_year1_total")
    private BigDecimal taxYear1Total;

    @Column(name = "tax_year2")
    private String taxYear2;

    @Column(name = "tax_year2_property")
    private BigDecimal taxYear2Property;

    @Column(name = "tax_year2_water")
    private BigDecimal taxYear2Water;

    @Column(name = "tax_year2_total")
    private BigDecimal taxYear2Total;

    @Column(name = "tax_year3")
    private String taxYear3;

    @Column(name = "tax_year3_property")
    private BigDecimal taxYear3Property;

    @Column(name = "tax_year3_water")
    private BigDecimal taxYear3Water;

    @Column(name = "tax_year3_total")
    private BigDecimal taxYear3Total;

    @Column(name = "tax_payment_status")
    private String taxPaymentStatus;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "satbara_ref")
    private String satbaraRef;

    @Column(name = "registration_no")
    private String registrationNo;

    @Column(name = "building_approval_ref")
    private String buildingApprovalRef;

    @Column(name = "occupancy_cert_no")
    private String occupancyCertNo;

    @Column(name = "tax_receipt_no")
    private String taxReceiptNo;

    @Column(name = "document_id")
    private String documentId;

    @Column(name = "generated_date")
    private LocalDateTime generatedDate;

    @Column(name = "corporation_name")
    private String corporationName;

    @Column(name = "commissioner_name")
    private String commissionerName;

    @Column(name = "verification_status")
    private String verificationStatus;
}