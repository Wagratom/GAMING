package com.transcender.main.adapters.out.jpa.repository;

import com.transcender.main.adapters.out.jpa.entity.MessageCoreJpa;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessagesRepository extends JpaRepository<MessageCoreJpa, Long> {
}
