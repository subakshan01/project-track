import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="page-container">
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-start">
        <div><h1>Projects</h1><p>Create and manage department projects</p></div>
        <button class="btn btn-primary" (click)="showCreate=true">+ New Project</button>
      </div>
      <div class="filter-bar">
        <div class="search-wrapper">
          <input class="search-input" placeholder="Search projects..." [(ngModel)]="search" style="padding-left:14px">
        </div>
        <select class="filter-select" [(ngModel)]="filterDept" (change)="load()">
          <option value="">All Departments</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Information Technology">Information Technology</option>
          <option value="Electronics">Electronics</option>
        </select>
        <select class="filter-select" [(ngModel)]="filterStatus" (change)="load()">
          <option value="">All Status</option>
          <option value="Not Started">Not Started</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <div *ngIf="loading" class="loading-container"><div class="spinner"></div></div>
      <div *ngIf="!loading" class="card-grid">
        <a *ngFor="let p of filtered" [routerLink]="['/projects', p._id]" style="text-decoration:none;color:inherit">
          <div class="card project-card">
            <div class="project-card-header">
              <span class="badge" [ngClass]="{'badge-blue':p.status==='Ongoing','badge-green':p.status==='Completed','badge-yellow':p.status==='Not Started'}">{{p.status}}</span>
              <span class="badge" [ngClass]="{'badge-red':p.level==='High','badge-yellow':p.level==='Medium','badge-teal':p.level==='Low'}">{{p.level}}</span>
            </div>
            <h3>{{p.name}}</h3>
            <p>{{p.description?.substring(0,120)}}...</p>
            <div class="project-meta">
              <span class="project-meta-item">👥 {{p.memberCount}}/{{p.maxMembers}}</span>
              <span class="project-meta-item">📂 {{p.department}}</span>
              <span *ngIf="p.vacancyCount > 0" class="project-meta-item" style="color:var(--accent-green)">✅ {{p.vacancyCount}} openings</span>
            </div>
          </div>
        </a>
      </div>

      <!-- Create Project Modal -->
      <div class="modal-overlay" *ngIf="showCreate" (click)="showCreate=false">
        <div class="modal" (click)="$event.stopPropagation()">
          <h2>Create New Project</h2>
          <form (ngSubmit)="createProject()">
            <div class="form-group">
              <label>Project Name</label>
              <input class="form-input" [(ngModel)]="newProject.name" name="name" required>
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea class="form-textarea" [(ngModel)]="newProject.description" name="desc" required></textarea>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
              <div class="form-group">
                <label>Department</label>
                <select class="form-select" [(ngModel)]="newProject.department" name="dept" required>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics">Electronics</option>
                </select>
              </div>
              <div class="form-group">
                <label>Max Members</label>
                <input class="form-input" type="number" [(ngModel)]="newProject.maxMembers" name="max" min="1" required>
              </div>
              <div class="form-group">
                <label>Level</label>
                <select class="form-select" [(ngModel)]="newProject.level" name="level">
                  <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option>
                </select>
              </div>
              <div class="form-group">
                <label>Status</label>
                <select class="form-select" [(ngModel)]="newProject.status" name="status">
                  <option value="Not Started">Not Started</option><option value="Ongoing">Ongoing</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Vacancies (one per line: RoleName | Skill1, Skill2)</label>
              <textarea class="form-textarea" [(ngModel)]="vacancyText" name="vac" placeholder="Backend Developer | Node.js, MongoDB&#10;Frontend Developer | React, CSS"></textarea>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="showCreate=false">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="creating">{{creating ? 'Creating...' : 'Create Project'}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ProjectsComponent implements OnInit {
  projects: any[] = [];
  loading = true;
  search = '';
  filterDept = '';
  filterStatus = '';
  showCreate = false;
  creating = false;
  vacancyText = '';
  newProject: any = { name: '', description: '', department: 'Computer Science', maxMembers: 4, level: 'Medium', status: 'Not Started' };

  constructor(private api: ApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    const params: any = {};
    if (this.filterDept) params.department = this.filterDept;
    if (this.filterStatus) params.status = this.filterStatus;
    this.api.getProjects(params).subscribe((r: any) => { this.projects = r.data; this.loading = false; });
  }

  get filtered() {
    return this.projects.filter(p => !this.search || p.name.toLowerCase().includes(this.search.toLowerCase()));
  }

  createProject() {
    this.creating = true;
    const vacancies = this.vacancyText.split('\n').filter(l => l.trim()).map(l => {
      const [role, skills] = l.split('|').map(s => s.trim());
      return { role, requiredSkills: skills ? skills.split(',').map((s: string) => s.trim()) : [] };
    });
    this.api.createProject({ ...this.newProject, vacancies }).subscribe({
      next: () => { this.showCreate = false; this.creating = false; this.load();
        this.newProject = { name: '', description: '', department: 'Computer Science', maxMembers: 4, level: 'Medium', status: 'Not Started' };
        this.vacancyText = ''; },
      error: () => this.creating = false
    });
  }
}
