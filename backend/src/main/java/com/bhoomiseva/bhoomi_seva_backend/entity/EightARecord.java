package com.bhoomiseva.bhoomi_seva_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "eight_a_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EightARecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "eight_a_id")
    private Long eightAId;

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

    @Column(name = "bhoomapan_kramank")
    private Integer bhoomapanKramank;

    @Column(name = "area_hectare")
    private BigDecimal areaHectare;

    @Column(name = "land_type")
    private String landType;

    @Column(name = "bhogatdar_varga")
    private String bhogatdarVarga;

    @Column(name = "owner1_name")
    private String owner1Name;

    @Column(name = "owner1_father_name")
    private String owner1FatherName;

    @Column(name = "owner1_address")
    private String owner1Address;

    @Column(name = "owner1_hakka_prakar")
    private String owner1HakkaPrakar;

    @Column(name = "owner1_hissa")
    private String owner1Hissa;

    @Column(name = "owner1_khate_kramank")
    private Integer owner1KhateKramank;

    @Column(name = "owner1_nond_date")
    private String owner1NondDate;

    @Column(name = "owner1_shera")
    private String owner1Shera;

    @Column(name = "owner2_name")
    private String owner2Name;

    @Column(name = "owner2_father_name")
    private String owner2FatherName;

    @Column(name = "owner2_address")
    private String owner2Address;

    @Column(name = "owner2_hakka_prakar")
    private String owner2HakkaPrakar;

    @Column(name = "owner2_hissa")
    private String owner2Hissa;

    @Column(name = "owner2_khate_kramank")
    private Integer owner2KhateKramank;

    @Column(name = "owner2_nond_date")
    private String owner2NondDate;

    @Column(name = "owner2_shera")
    private String owner2Shera;

    @Column(name = "kshetra_hectare")
    private BigDecimal kshetraHectare;

    @Column(name = "acre_aakaar")
    private Integer acreAakaar;

    @Column(name = "pik_paddhati")
    private String pikPaddhati;

    @Column(name = "sinchan_sadhan")
    private String sinchanSadhan;

    @Column(name = "lagwad_kshamata")
    private String lagwadKshamata;

    @Column(name = "shera")
    private String shera;

    @Column(name = "adhibhar")
    private String adhibhar;

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