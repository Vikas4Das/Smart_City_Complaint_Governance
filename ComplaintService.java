package com.example.smartcitygovernance.service;

import com.example.smartcitygovernance.dto.ComplaintRequest;
import com.example.smartcitygovernance.dto.ComplaintResponse;

import java.util.List;

public interface ComplaintService {

    ComplaintResponse raiseComplaint(ComplaintRequest request, String username);

    List<ComplaintResponse> getAllComplaints();

    List<ComplaintResponse> getComplaintsByCitizen(String username);

    List<ComplaintResponse> getComplaintsByOfficer(String username);

    ComplaintResponse updateStatus(Long complaintId, String status);
}
