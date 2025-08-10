package com.transcender.main.adapters.out.jpa.repository;

import com.transcender.main.adapters.out.jpa.entity.FriendCoreJpa;
import com.transcender.main.adapters.out.jpa.entity.UserCoreJpa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRepository extends JpaRepository<FriendCoreJpa, Long> {
    @Query(value = """
    SELECT u.*
    FROM amigos a
    JOIN usuarios u
        ON (a.usuario1_id = :userId AND a.usuario2_id = u.id)
        OR (a.usuario2_id = :userId AND a.usuario1_id = u.id)
    WHERE
        a.status = 'ACCEPTED'
        AND u.ative = true
    """, nativeQuery = true)
    List<UserCoreJpa> findAcceptedFriendsByUserId(@Param("userId") Long userId);

    @Query(value = """
    SELECT
        CASE
            WHEN COUNT(*) > 0 THEN TRUE
            ELSE FALSE
        END
    FROM amigos
    WHERE
        ((usuario_1_id = :userId1 AND usuario_2_id = :userId2)
         OR (usuario_1_id = :userId2 AND usuario_2_id = :userId1))
        AND status = 'BLOCKED'
    """, nativeQuery = true)
    boolean existsBlockedFriendshipByUserId(@Param("userId1") Long userId1,
                                            @Param("userId2") Long userId2);


    //Verifica se existe uma coluna de amizade entre os usuarios
    @Query("""
    SELECT a FROM AmizadeCoreJpa a
    WHERE (a.usuario1.id = :userId1 AND a.usuario2.id = :userId2)
       OR (a.usuario1.id = :userId2 AND a.usuario2.id = :userId1)
    """)
    Optional<FriendCoreJpa> findFriendshipBetweenUsers(@Param("userId1") Long userId1,
                                                       @Param("userId2") Long userId2);


}
