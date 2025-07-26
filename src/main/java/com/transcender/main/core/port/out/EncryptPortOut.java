package com.transcender.main.core.port.out;

public interface EncryptPortOut {
    String encryptPassword(String password);
    boolean checkPassword(String password, String hashedPassword);
}
