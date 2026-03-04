import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ComplaintService {

  private api = 'http://localhost:8080/api/complaints';

  constructor(private http: HttpClient) {}

  createComplaint(data: FormData) {
    return this.http.post(this.api, data);
  }

  getMyComplaints() {
    return this.http.get(`${this.api}/my`);
  }

  getAssignedComplaints() {
    return this.http.get(`${this.api}/assigned`);
  }

  updateStatus(id: number, status: string) {
    return this.http.put(`${this.api}/${id}/status`, { status });
  }
}