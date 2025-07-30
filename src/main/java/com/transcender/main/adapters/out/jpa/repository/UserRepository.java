package com.transcender.main.adapters.out.jpa.repository;

import com.transcender.main.adapters.out.jpa.entity.UsuarioCoreJpa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UsuarioCoreJpa, Long> {
    Optional<UsuarioCoreJpa> findByEmail(String email);
    Optional<UsuarioCoreJpa> findByNickname(String nickname);
    List<UsuarioCoreJpa> findByOnlineTrueAndAtiveTrue();
}
