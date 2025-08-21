package com.pahanaedu.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Allow all origins for development
public class AuthController {

    /**
     * Mock login endpoint - returns success for any credentials
     * This is for development/demo purposes only
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {

        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        // Log the login attempt
        System.out.println("Mock login attempt - Username: " + username);

        // Mock successful response for any credentials
        Map<String, Object> response = new HashMap<>();
        response.put("token", "mock-jwt-token-" + System.currentTimeMillis());
        response.put("type", "Bearer");
        response.put("username", username);
        response.put("role", username.equals("admin") ? "ADMIN" : "USER");
        response.put("expiresIn", 86400000L); // 24 hours
        response.put("message", "Login successful (mock)");

        return ResponseEntity.ok(response);
    }

    /**
     * Mock logout endpoint
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logout successful");
        return ResponseEntity.ok(response);
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Auth Service");
        response.put("mode", "MOCK");
        return ResponseEntity.ok(response);
    }
}
