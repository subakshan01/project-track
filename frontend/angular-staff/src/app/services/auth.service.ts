import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://project-track-8i5i.onrender.com/api';
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    const stored = localStorage.getItem('techtrack_user');
    if (stored) {
      try { this.userSubject.next(JSON.parse(stored)); } catch {}
    }
  }

  get currentUser(): any { return this.userSubject.value; }
  get isLoggedIn(): boolean { return !!this.currentUser && !!localStorage.getItem('techtrack_token'); }
  get token(): string | null { return localStorage.getItem('techtrack_token'); }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap((res: any) => {
        localStorage.setItem('techtrack_token', res.token);
        localStorage.setItem('techtrack_user', JSON.stringify(res.user));
        this.userSubject.next(res.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('techtrack_token');
    localStorage.removeItem('techtrack_user');
    this.userSubject.next(null);
  }

  getMe(): Observable<any> { return this.http.get(`${this.apiUrl}/auth/me`); }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/profile`, data).pipe(
      tap((res: any) => {
        localStorage.setItem('techtrack_user', JSON.stringify(res.data));
        this.userSubject.next(res.data);
      })
    );
  }

  updateAvailability(availability: string, timeSlots?: string[]): Observable<any> {
    const body: any = { availability };
    if (timeSlots !== undefined) body.timeSlots = timeSlots;
    return this.http.put(`${this.apiUrl}/users/availability`, body);
  }

  registerStaff(data: { name: string; email: string; password: string; department: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register-staff`, data);
  }
}
