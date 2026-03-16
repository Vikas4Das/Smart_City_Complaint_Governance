package com.example.smartcitygovernance.controller;

import com.example.smartcitygovernance.dto.ComplaintRequest;
import com.example.smartcitygovernance.dto.ComplaintResponse;
import com.example.smartcitygovernance.service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    //CITIZEN APIs

    @PostMapping("/citizen/complaints")
    public ResponseEntity<ComplaintResponse> raiseComplaint(
            @Valid @RequestBody ComplaintRequest request,
            Authentication authentication) {

        String username = authentication.getName();
        ComplaintResponse response =
                complaintService.raiseComplaint(request, username);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/citizen/my-complaints")
    public ResponseEntity<List<ComplaintResponse>> getMyComplaints(
            Authentication authentication) {

        String username = authentication.getName();

        return ResponseEntity.ok(
                complaintService.getComplaintsByCitizen(username)
        );
    }

    // ADMIN APIs

    @GetMapping("/admin/complaints")
    public ResponseEntity<List<ComplaintResponse>> getAllComplaints() {

        return ResponseEntity.ok(
                complaintService.getAllComplaints()
        );
    }
}