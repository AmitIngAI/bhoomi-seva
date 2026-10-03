package com.bhoomiseva.bhoomi_seva_backend.repository;

import com.bhoomiseva.bhoomi_seva_backend.entity.UserPrediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserPredictionRepository extends JpaRepository<UserPrediction, Long> {
    List<UserPrediction> findByUserIdOrderByPredictionDateDesc(Long userId);
}