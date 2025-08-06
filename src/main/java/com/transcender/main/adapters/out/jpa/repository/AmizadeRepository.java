package com.transcender.main.adapters.out.jpa.repository;

import com.transcender.main.adapters.out.jpa.entity.AmizadeJpa;
import com.transcender.main.adapters.out.jpa.entity.UserCoreJpa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AmizadeRepository extends JpaRepository<AmizadeJpa, Long> {
    @Query(value = """
        SELECT u.* FROM amigos a
        JOIN usuarios u ON 
            (a.usuario1_id = :userId AND a.usuario2_id = u.id)
            OR
            (a.usuario2_id = :userId AND a.usuario1_id = u.id)
        WHERE 
            a.status = 'ACEITA'
            AND u.ative = true
        """, nativeQuery = true
    )
    List<UserCoreJpa> buscarAmigosAtivos(@Param("userId") Long userId);

}
