package com.example.smartcitygovernance.service;

import com.example.smartcitygovernance.dto.LoginRequest;
import com.example.smartcitygovernance.dto.RegisterRequest;

public interface AuthService {

    String registerUser(RegisterRequest request);

    String loginUser(LoginRequest request);
}
