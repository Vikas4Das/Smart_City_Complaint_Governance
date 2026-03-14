package com.example.smartcitygovernance.serviceImpl;

import com.example.smartcitygovernance.dto.LoginRequest;
import com.example.smartcitygovernance.dto.RegisterRequest;
import com.example.smartcitygovernance.model.Role;
import com.example.smartcitygovernance.model.User;
import com.example.smartcitygovernance.repository.UserRepository;
import com.example.smartcitygovernance.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public String registerUser(RegisterRequest request) {

        // Check if username already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return "Username already exists!";
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Convert String role to Enum
        user.setRole(Role.valueOf(request.getRole().toUpperCase()));

        userRepository.save(user);

        return "User registered successfully!";
    }

    @Override
    public String loginUser(LoginRequest request) {

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return "Login successful!";
    }
}
