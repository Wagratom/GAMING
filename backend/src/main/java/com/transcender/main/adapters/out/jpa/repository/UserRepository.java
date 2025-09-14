package com.transcender.main.adapters.out.jpa.repository;

import com.transcender.main.adapters.out.jpa.entity.UserCoreJpa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserCoreJpa, Long> {
    Optional<UserCoreJpa> findByEmail(String email);
    Optional<UserCoreJpa> findByNickname(String nickname);
    List<UserCoreJpa> findByOnlineTrueAndAtiveTrue();
}
