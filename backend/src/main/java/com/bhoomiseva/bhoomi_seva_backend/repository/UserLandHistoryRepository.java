package com.bhoomiseva.bhoomi_seva_backend.repository;

import com.bhoomiseva.bhoomi_seva_backend.entity.UserLandHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserLandHistoryRepository extends JpaRepository<UserLandHistory, Long> {

    List<UserLandHistory> findByUserIdOrderByViewedAtDesc(Long userId);

    Optional<UserLandHistory> findByUserIdAndRecordId(Long userId, Long recordId);

    long countByUserId(Long userId);

    // Find oldest entry for a user
    Optional<UserLandHistory> findFirstByUserIdOrderByViewedAtAsc(Long userId);
}