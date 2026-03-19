package com.example.smartcitygovernance.controller;

import com.example.smartcitygovernance.dto.ComplaintResponse;
import com.example.smartcitygovernance.service.AdminService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // View all complaints
    @GetMapping("/complaints")
    public List<ComplaintResponse> getAllComplaints() {
        return adminService.getAllComplaints();
    }

    // Assign officer to complaint
    @PutMapping("/assign-officer/{complaintId}")
    public ComplaintResponse assignOfficer(
            @PathVariable Long complaintId,
            @RequestParam String officerUsername) {

        return adminService.assignOfficer(complaintId, officerUsername);
    }
}
