package com.bhoomiseva.bhoomi_seva_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "satbara_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SatbaraRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "satbara_id")
    private Long satbaraId;

    @Column(name = "record_id")
    private Long recordId;

    @Column(name = "survey_no")
    private String surveyNo;

    @Column(name = "village")
    private String village;

    @Column(name = "taluka")
    private String taluka;

    @Column(name = "district")
    private String district;

    @Column(name = "sheet_no")
    private Integer sheetNo;

    @Column(name = "area_hectare")
    private BigDecimal areaHectare;

    @Column(name = "land_type")
    private String landType;

    @Column(name = "owner_name")
    private String ownerName;

    @Column(name = "owner_address")
    private String ownerAddress;

    @Column(name = "kshetra")
    private String kshetra;

    @Column(name = "acre_aakaar")
    private Integer acreAakaar;

    @Column(name = "bhogatdar_varga")
    private String bhogatdarVarga;

    @Column(name = "pik_paddhati")
    private String pikPaddhati;

    @Column(name = "potkharcha")
    private BigDecimal potkharcha;

    @Column(name = "fress")
    private BigDecimal fress;

    @Column(name = "itar")
    private BigDecimal itar;

    @Column(name = "ekun_aakarani")
    private BigDecimal ekunAakarani;

    @Column(name = "kharip_crop")
    private String kharipCrop;

    @Column(name = "kharip_area")
    private BigDecimal kharipArea;

    @Column(name = "kharip_aakarani")
    private BigDecimal kharipAakarani;

    @Column(name = "rabi_crop")
    private String rabiCrop;

    @Column(name = "rabi_area")
    private BigDecimal rabiArea;

    @Column(name = "rabi_aakarani")
    private BigDecimal rabiAakarani;

    @Column(name = "itar_adhikar")
    private String itarAdhikar;

    @Column(name = "document_id")
    private String documentId;

    @Column(name = "generated_date")
    private LocalDateTime generatedDate;

    @Column(name = "generated_by")
    private String generatedBy;

    @Column(name = "talathi_name")
    private String talathiName;

    @Column(name = "verification_status")
    private String verificationStatus;
}