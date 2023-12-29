package com.example.thicketbatch.repository;


import com.example.thicketbatch.stage.Chair;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface ChairRepository extends JpaRepository<Chair, UUID> {

    // 좌석의 availableCount 조회
    @Query("SELECT c.count FROM Chair c WHERE c.id = :chairId")
    Integer findCountByChairId(@Param("chairId") UUID chairId);

    // 좌석의 availableCount 갱신
    @Modifying
    @Query("UPDATE Chair c SET c.availableCount = :count WHERE c.id = :chairId")
    void updateAvailableCountByChairId(@Param("chairId") UUID chairId, @Param("count") int count);


}
