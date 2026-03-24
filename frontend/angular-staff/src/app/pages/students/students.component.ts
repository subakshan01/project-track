import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header"><h1>Students</h1><p>View and review student profiles</p></div>
      <div class="filter-bar">
        <input class="search-input" placeholder="Search students..." [(ngModel)]="search" style="padding-left:14px;flex:1;min-width:240px">
        <select class="filter-select" [(ngModel)]="filterDept" (change)="load()">
          <option value="">All Departments</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Information Technology">Information Technology</option>
          <option value="Electronics">Electronics</option>
        </select>
      </div>
      <div *ngIf="loading" class="loading-container"><div class="spinner"></div></div>
      <div *ngIf="!loading" class="card-grid">
        <div *ngFor="let s of filtered" class="card" style="cursor:pointer" (click)="selectStudent(s)">
          <div style="display:flex;gap:16px;align-items:center">
            <div class="staff-avatar" style="width:60px;height:60px;font-size:1.5rem;background:var(--gradient-success)">{{s.name?.charAt(0)}}</div>
            <div>
              <h3 style="font-size:1.1rem;margin-bottom:4px">{{s.name}}</h3>
              <div style="font-size:0.85rem;color:var(--text-muted)">{{s.studentId}} · {{s.department}} · Year {{s.year}}</div>
              <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:6px">
                <span *ngFor="let l of s.languages?.slice(0,4)" class="skill-tag">{{l}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Student Detail Modal -->
      <div class="modal-overlay" *ngIf="selected" (click)="selected=null">
        <div class="modal" (click)="$event.stopPropagation()" style="max-width:640px">
          <div style="display:flex;gap:16px;align-items:center;margin-bottom:1.5rem">
            <div class="profile-avatar" style="width:80px;height:80px;font-size:2rem">{{selectedProfile?.name?.charAt(0)}}</div>
            <div>
              <h2 style="margin-bottom:4px">{{selectedProfile?.name}}</h2>
              <div style="color:var(--text-secondary)">{{selectedProfile?.department}} · Year {{selectedProfile?.year}}</div>
              <div style="font-size:0.85rem;color:var(--text-muted)">ID: {{selectedProfile?.studentId}} · Roll: {{selectedProfile?.rollNumber}}</div>
            </div>
          </div>
          <div *ngIf="selectedProfile?.bio" style="margin-bottom:1rem;color:var(--text-secondary)">{{selectedProfile.bio}}</div>
          <div *ngIf="selectedProfile?.languages?.length" style="margin-bottom:1rem">
            <h4 style="font-size:0.9rem;margin-bottom:8px">Skills & Languages</h4>
            <div style="display:flex;flex-wrap:wrap;gap:6px">
              <span *ngFor="let l of selectedProfile.languages" class="language-tag">{{l}}</span>
            </div>
          </div>
          <div style="margin-bottom:1rem;display:flex;gap:1rem">
            <div style="padding:8px 16px;background:var(--bg-elevated);border-radius:var(--radius-sm);border:1px solid var(--border);flex:1;text-align:center">
              <div style="font-weight:600;color:var(--accent-blue)">{{selectedProfile?.preferredRole || 'N/A'}}</div>
              <div style="font-size:0.75rem;color:var(--text-muted)">Preferred Role</div>
            </div>
            <div style="padding:8px 16px;background:var(--bg-elevated);border-radius:var(--radius-sm);border:1px solid var(--border);flex:1;text-align:center">
              <div style="font-weight:600;color:var(--accent-green)">{{selectedProfile?.bestFitRole || 'N/A'}}</div>
              <div style="font-size:0.75rem;color:var(--text-muted)">Best Fit Role</div>
            </div>
          </div>
          <div *ngIf="selectedProfile?.projects?.length">
            <h4 style="font-size:0.9rem;margin-bottom:8px">Projects</h4>
            <div *ngFor="let p of selectedProfile.projects" style="padding:8px;background:var(--bg-elevated);border-radius:var(--radius-sm);margin-bottom:6px;display:flex;justify-content:space-between">
              <span>{{p.name}}</span>
              <span class="badge" [ngClass]="{'badge-blue':p.status==='Ongoing','badge-green':p.status==='Completed','badge-yellow':p.status==='Not Started'}">{{p.status}}</span>
            </div>
          </div>
          <div class="modal-actions"><button class="btn btn-secondary" (click)="selected=null">Close</button></div>
        </div>
      </div>
    </div>
  `
})
export class StudentsComponent implements OnInit {
  students: any[] = [];
  loading = true;
  search = '';
  filterDept = '';
  selected: any = null;
  selectedProfile: any = null;

  constructor(private api: ApiService) {}
  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    const params: any = {};
    if (this.filterDept) params.department = this.filterDept;
    this.api.getStudents(params).subscribe((r: any) => { this.students = r.data; this.loading = false; });
  }

  get filtered() {
    return this.students.filter(s => !this.search || s.name.toLowerCase().includes(this.search.toLowerCase()));
  }

  selectStudent(s: any) {
    this.selected = s;
    this.api.getStudentProfile(s._id).subscribe((r: any) => this.selectedProfile = r.data);
  }
}
