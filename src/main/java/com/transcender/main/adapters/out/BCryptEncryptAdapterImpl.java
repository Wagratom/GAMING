package com.transcender.main.adapters.out;

import com.transcender.main.core.port.out.EncryptPortOut;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Component;

@Component
public class BCryptEncryptAdapterImpl implements EncryptPortOut {

    @Override
    public String encryptPassword(String password) {
        // Gera o hash com salt embutido
        return BCrypt.hashpw(password, BCrypt.gensalt());
    }

    @Override
    public boolean checkPassword(String plainPassword, String hashedPassword) {
        // Verifica se a senha corresponde ao hash
        return BCrypt.checkpw(plainPassword, hashedPassword);
    }
}
