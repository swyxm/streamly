package com.twitch.clone.userservice.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenerator {
    public static void main(String[] args) {
        if (args.length == 0) {
            System.out.println("Usage: java PasswordGenerator <password>");
            System.out.println("Example: java PasswordGenerator testpass123");
            return;
        }
        
        String rawPassword = args[0];
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String encodedPassword = encoder.encode(rawPassword);
        
        System.out.println("Password: " + rawPassword);
        System.out.println("BCrypt Hash: " + encodedPassword);
        
        System.out.println("\n-- SQL to update password in the database:");
        System.out.println(String.format("UPDATE users SET password = '%s' WHERE username = 'testuser';", encodedPassword));
    }
}
