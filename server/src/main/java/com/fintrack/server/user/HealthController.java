package com.fintrack.server.user;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class HealthController {
    @GetMapping("/health")
    public String healthCheck() {
        return "Service is running!";
    }

    @GetMapping("/tracker/hello")
    public String hello() {
        return "Hello from Spring Boot!";
    }
}