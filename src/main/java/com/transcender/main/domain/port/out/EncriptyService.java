package com.transcender.main.domain.port.out;

public interface EncriptyService {
    String encryptPassword(String password);
    boolean checkPassword(String password, String hashedPassword);
}
