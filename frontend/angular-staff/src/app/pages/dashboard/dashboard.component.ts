import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container">
      <div class="dashboard-hero">
        <h2>Welcome, {{auth.currentUser?.name?.split(' ')[0]}} 👋</h2>
        <p>Manage projects, review student requests, and allocate roles from your staff portal.</p>
        <a routerLink="/projects" class="btn btn-primary" style="margin-top:1rem">📁 Manage Projects</a>
      </div>
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-value">{{stats.total}}</div><div class="stat-label">Total Projects</div></div>
        <div class="stat-card"><div class="stat-value">{{stats.ongoing}}</div><div class="stat-label">Ongoing</div></div>
        <div class="stat-card"><div class="stat-value">{{stats.completed}}</div><div class="stat-label">Completed</div></div>
        <div class="stat-card"><div class="stat-value">{{stats.students}}</div><div class="stat-label">Students</div></div>
      </div>
      <h2 class="section-title">📅 Events & Announcements</h2>
      <div class="event-list">
        <div class="event-card" *ngFor="let e of events">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <h4>{{e.title}}</h4>
            <span class="badge badge-purple">{{e.type}}</span>
          </div>
          <p>{{e.desc}}</p>
          <span class="event-date">📅 {{e.date}}</span>
        </div>
      </div>
      <div class="detail-card" style="margin-top:2rem">
        <h2>About TechTrack</h2>
        <p style="color:var(--text-secondary);line-height:1.8">TechTrack is a comprehensive project management and staffing platform for educational institutions. This staff portal allows faculty to create and manage projects, review student applications, verify uploaded documents, allocate roles, and track project progress through completion and archival.</p>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  stats = { total: 0, ongoing: 0, completed: 0, pendingDocs: 0, students: 0 };
  events = [
    { title: 'HackVerse 2026', desc: 'National 48-hour hackathon – Organize teams', date: 'April 15-17, 2026', type: 'Hackathon' },
    { title: 'Tech Summit', desc: 'Inter-college tech summit – 20+ colleges', date: 'May 5, 2026', type: 'Inter-College' },
    { title: 'AI/ML Workshop', desc: 'Department ML workshop series', date: 'April 3-5, 2026', type: 'Workshop' },
    { title: 'IoT Innovation Expo', desc: 'Electronics dept project exhibition', date: 'May 12, 2026', type: 'Department' }
  ];
  constructor(public auth: AuthService, private api: ApiService) {}
  ngOnInit() {
    this.api.getProjects().subscribe((r: any) => {
      this.stats.total = r.count;
      this.stats.ongoing = r.data.filter((p: any) => p.status === 'Ongoing').length;
      this.stats.completed = r.data.filter((p: any) => p.status === 'Completed').length;
    });
    this.api.getPendingDocuments().subscribe((r: any) => this.stats.pendingDocs = r.count);
    this.api.getStudents().subscribe((r: any) => this.stats.students = r.count);
  }
}
