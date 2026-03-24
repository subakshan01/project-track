import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private api = 'https://project-track-8i5i.onrender.com/api';

  constructor(private http: HttpClient) {}

  // Projects
  getProjects(params?: any): Observable<any> {
    let p = new HttpParams();
    if (params) Object.keys(params).forEach(k => { if (params[k]) p = p.set(k, params[k]); });
    return this.http.get(`${this.api}/projects`, { params: p });
  }
  getProject(id: string): Observable<any> { return this.http.get(`${this.api}/projects/${id}`); }
  createProject(data: any): Observable<any> { return this.http.post(`${this.api}/projects`, data); }
  updateProject(id: string, data: any): Observable<any> { return this.http.put(`${this.api}/projects/${id}`, data); }
  deleteProject(id: string): Observable<any> { return this.http.delete(`${this.api}/projects/${id}`); }
  getProjectRequests(id: string): Observable<any> { return this.http.get(`${this.api}/projects/${id}/requests`); }
  reviewRequest(projectId: string, requestId: string, data: any): Observable<any> {
    return this.http.put(`${this.api}/projects/${projectId}/requests/${requestId}`, data);
  }

  // Users
  getStudents(params?: any): Observable<any> {
    let p = new HttpParams();
    if (params) Object.keys(params).forEach(k => { if (params[k]) p = p.set(k, params[k]); });
    return this.http.get(`${this.api}/users/students`, { params: p });
  }
  getStudentProfile(id: string): Observable<any> { return this.http.get(`${this.api}/users/student/${id}`); }

  // Notifications
  getNotifications(params?: any): Observable<any> {
    let p = new HttpParams();
    if (params) Object.keys(params).forEach(k => { if (params[k]) p = p.set(k, params[k]); });
    return this.http.get(`${this.api}/notifications`, { params: p });
  }
  markRead(id: string): Observable<any> { return this.http.put(`${this.api}/notifications/${id}/read`, {}); }
  markAllRead(): Observable<any> { return this.http.put(`${this.api}/notifications/read-all`, {}); }

  // Chat
  getMessages(projectId: string): Observable<any> { return this.http.get(`${this.api}/chat/${projectId}`); }
  postMessage(projectId: string, message: string): Observable<any> {
    return this.http.post(`${this.api}/chat/${projectId}`, { message });
  }

  // Documents
  getPendingDocuments(): Observable<any> { return this.http.get(`${this.api}/documents/pending`); }
  getStudentDocuments(studentId: string): Observable<any> { return this.http.get(`${this.api}/documents/student/${studentId}`); }
  verifyDocument(id: string, data: any): Observable<any> { return this.http.put(`${this.api}/documents/${id}/verify`, data); }

  // Member Management
  removeMember(projectId: string, memberId: string): Observable<any> {
    return this.http.delete(`${this.api}/projects/${projectId}/members/${memberId}`);
  }
  toggleSenior(projectId: string, memberId: string): Observable<any> {
    return this.http.put(`${this.api}/projects/${projectId}/members/${memberId}/senior`, {});
  }
}
