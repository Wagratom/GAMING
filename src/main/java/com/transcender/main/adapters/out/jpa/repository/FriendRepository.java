package com.transcender.main.adapters.out.jpa.repository;

import com.transcender.main.adapters.out.jpa.entity.FriendCoreJpa;
import com.transcender.main.adapters.out.jpa.entity.UserCoreJpa;
import com.transcender.main.domain.enuns.FriendStatus;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRepository extends JpaRepository<FriendCoreJpa, Long> {

    // Verifica amizade entre dois usuários com um status específico
    @Query(value = """
        SELECT a.*
        FROM amigos a
        WHERE ((a.usuario1_id = :userId1 AND a.usuario2_id = :userId2)
            OR  (a.usuario1_id = :userId2 AND a.usuario2_id = :userId1))
          AND a.status = :status
        """, nativeQuery = true)
    Optional<FriendCoreJpa> findFriendsByUsersIdAndStatus(
            @Param("userId1") Long userId1,
            @Param("userId2") Long userId2,
            @Param("status") String status
    );

    // Lista todos os amigos de um usuário com um status específico
    @Query(value = """
        SELECT u.*
        FROM amigos a
        JOIN usuarios u
            ON (u.id = a.usuario1_id AND a.usuario2_id = :userId1)
            OR (u.id = a.usuario2_id AND a.usuario1_id = :userId1)
        WHERE a.status = :status
          AND u.ative = true
        """, nativeQuery = true)
    List<UserCoreJpa> findFriendsListByUserIdAndStatus(
            @Param("userId1") Long userId1,
            @Param("status") String status
    );

    // Busca amizade entre dois usuários (sem status)
    @Query(value = """
        SELECT a.*
        FROM amigos a
        WHERE (a.usuario1_id = :userId1 AND a.usuario2_id = :userId2)
           OR (a.usuario1_id = :userId2 AND a.usuario2_id = :userId1)
        """, nativeQuery = true)
    Optional<FriendCoreJpa> findFriendsByUsersId(
            @Param("userId1") Long userId1,
            @Param("userId2") Long userId2
    );

    // JPQL - Busca amizade entre dois usuários
    @Query("""
        SELECT a FROM FriendCoreJpa a
        WHERE (a.usuario1.id = :userId1 AND a.usuario2.id = :userId2)
           OR (a.usuario1.id = :userId2 AND a.usuario2.id = :userId1)
        """)
    Optional<FriendCoreJpa> findFriendshipBetweenUsers(
            @Param("userId1") Long userId1,
            @Param("userId2") Long userId2
    );

    // Solicitações enviadas
    @Query("""
        SELECT a FROM FriendCoreJpa a
        WHERE a.usuario1.id = :userId
        """)
    List<FriendCoreJpa> findFriendsSolicitadas(@Param("userId") Long userId);

    // Solicitações recebidas
    @Query("""
        SELECT a FROM FriendCoreJpa a
        WHERE a.usuario2.id = :userId
        """)
    List<FriendCoreJpa> findFriendsRecebidas(@Param("userId") Long userId);

    // Atualiza status de amizade
    @Modifying
    @Transactional
    @Query("""
        UPDATE FriendCoreJpa a
        SET a.status = :status
        WHERE (a.usuario1.id = :userId1 AND a.usuario2.id = :userId2)
           OR (a.usuario1.id = :userId2 AND a.usuario2.id = :userId1)
        """)
    int updateFriendStatus(
            @Param("userId1") Long userId1,
            @Param("userId2") Long userId2,
            @Param("status") FriendStatus status
    );
}
