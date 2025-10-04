package com.twitch.clone.userservice.service;

import com.twitch.clone.userservice.model.Role;
import com.twitch.clone.userservice.model.User;
import com.twitch.clone.userservice.repository.RoleRepository;
import com.twitch.clone.userservice.repository.UserRepository;
import com.twitch.clone.userservice.security.jwt.JwtUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Service
public class AuthService {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;
    
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    public String authenticateUser(String username, String password) {
        logger.info("Starting authentication for user: {}", username);
        
        try {
            logger.info("Looking up user in database: {}", username);
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    logger.error("User not found: {}", username);
                    return new RuntimeException("Invalid username or password");
                });
            
            logger.info("User found, checking password for: {}", username);
            if (!encoder.matches(password, user.getPassword())) {
                logger.error("Invalid password for user: {}", username);
                throw new RuntimeException("Invalid username or password");
            }
            
            logger.info("Password verified for user: {}", username);
            
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                user, 
                null,
                user.getAuthorities()
            );
            
            logger.info("Setting authentication in SecurityContext for user: {}", username);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            logger.info("Updating last login time for user: {}", username);
            user.setLastLoginAt(LocalDateTime.now());
            userRepository.save(user);
            
            logger.info("Generating JWT token for user: {}", username);
            String jwtToken = jwtUtils.generateTokenFromUsername(username);
            logger.info("Successfully generated JWT token for user: {}", username);
            return jwtToken;
            
        } catch (Exception e) {
            logger.error("Authentication failed for user {}: {}", username, e.getMessage(), e);
            throw new RuntimeException("Authentication failed: " + e.getMessage());
        }
    }

    public User registerUser(String username, String email, String password) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        User user = new User(username, email, encoder.encode(password));
        user.setLastLoginAt(LocalDateTime.now());

        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName("USER")
                .orElseGet(() -> {
                    Role role = new Role("USER", "Default user role");
                    return roleRepository.save(role);
                });
        roles.add(userRole);
        user.setRoles(roles);

        return userRepository.save(user);
    }
}
