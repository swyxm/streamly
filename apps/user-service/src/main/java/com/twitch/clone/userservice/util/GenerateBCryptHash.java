package com.twitch.clone.userservice.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerateBCryptHash {
    public static void main(String[] args) {
        String password = "testpass123";
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = encoder.encode(password);
        System.out.println("BCrypt Hash: " + hash);
        System.out.println("SQL to update password: UPDATE users SET password = '" + hash + "' WHERE username = 'testuser';");
    }
}
