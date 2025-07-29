package com.transcender.main.adapters.out.jpa.repository;

import com.transcender.main.adapters.out.jpa.entity.ChatCoreJpa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRepositoryImpl extends JpaRepository<ChatCoreJpa, Long> {
    // Aqui você já tem todos os métodos básicos (save, findById, delete, etc)
}
