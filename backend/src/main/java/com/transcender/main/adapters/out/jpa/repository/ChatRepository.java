package com.transcender.main.adapters.out.jpa.repository;

import com.transcender.main.adapters.out.jpa.entity.ChatCoreJpa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends JpaRepository<ChatCoreJpa, Long> {
    @Query("""
            SELECT c
            FROM ChatCoreJpa c
            JOIN c.usuarios cu
            WHERE c.type = com.transcender.main.domain.enuns.ChatType.PRIVATE
              AND cu.usuario.id IN :usuarios
            GROUP BY c.id
            HAVING COUNT(DISTINCT cu.usuario.id) = :size
            """)
    Optional<ChatCoreJpa> findPrivateChatBetweenUsers(@Param("usuarios") Collection<Long> usuarios,
                                                      @Param("size") long size);


    @Query("""
        SELECT c
        FROM ChatCoreJpa c
        WHERE c.type != com.transcender.main.domain.enuns.ChatType.PRIVATE
        """)
    List<ChatCoreJpa> getCreatedChats();


}
