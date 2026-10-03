package com.bhoomiseva.bhoomi_seva_backend.repository;

import com.bhoomiseva.bhoomi_seva_backend.entity.UserDownload;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserDownloadRepository extends JpaRepository<UserDownload, Long> {
    List<UserDownload> findByUserIdOrderByDownloadedAtDesc(Long userId);
}