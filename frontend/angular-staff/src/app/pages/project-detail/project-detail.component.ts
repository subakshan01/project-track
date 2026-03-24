import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="page-container" *ngIf="project">
      <div class="page-header">
        <div style="display:flex;gap:10px;margin-bottom:8px">
          <span class="badge" [ngClass]="{'badge-blue':project.status==='Ongoing','badge-green':project.status==='Completed','badge-yellow':project.status==='Not Started'}">{{project.status}}</span>
          <span class="badge" [ngClass]="{'badge-red':project.level==='High','badge-yellow':project.level==='Medium','badge-teal':project.level==='Low'}">{{project.level}}</span>
        </div>
        <h1 style="-webkit-text-fill-color:var(--text-primary);background:none">{{project.name}}</h1>
        <p>{{project.department}}</p>
      </div>

      <div class="detail-container">
        <div class="detail-main">
          <div class="detail-card">
            <h2>Description</h2>
            <p style="color:var(--text-secondary);line-height:1.8">{{project.description}}</p>
          </div>

          <!-- Update Status -->
          <div class="detail-card">
            <h2>Update Project</h2>
            <div style="display:flex;gap:12px;align-items:center">
              <select class="form-select" [(ngModel)]="editStatus" style="max-width:200px">
                <option value="Not Started">Not Started</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
              <button class="btn btn-primary btn-sm" (click)="updateStatus()">Update Status</button>
            </div>
          </div>

          <!-- Role Requests -->
          <div class="detail-card">
            <h2>Role Requests ({{requests.length}})</h2>
            <div *ngIf="requests.length === 0" class="empty-state" style="padding:1rem"><p>No pending requests</p></div>
            <div *ngFor="let req of requests" style="padding:16px;background:var(--bg-elevated);border-radius:var(--radius);border:1px solid var(--border);margin-bottom:12px">
              <div style="display:flex;justify-content:space-between;align-items:flex-start">
                <div>
                  <h4 style="margin-bottom:4px">{{req.student?.name}} – {{req.role}}</h4>
                  <div style="font-size:0.85rem;color:var(--text-muted)">{{req.student?.department}} · Year {{req.student?.year}} · {{req.student?.studentId}}</div>
                  <p style="font-size:0.9rem;color:var(--text-secondary);margin-top:8px">{{req.experienceDescription}}</p>
                  <div style="font-size:0.8rem;color:var(--text-muted);margin-top:6px">Skills: {{req.student?.languages?.join(', ')}}</div>
                </div>
                <span class="badge" [ngClass]="{'badge-yellow':req.status==='pending','badge-green':req.status==='approved','badge-red':req.status==='rejected'}">{{req.status}}</span>
              </div>
              <div *ngIf="req.status==='pending'" style="display:flex;gap:8px;margin-top:12px;align-items:center">
                <input class="form-input" [(ngModel)]="req._comment" placeholder="Add review comment..." style="flex:1;padding:6px 12px;font-size:0.85rem">
                <button class="btn btn-success btn-sm" (click)="reviewReq(req,'approved')">✓ Approve</button>
                <button class="btn btn-danger btn-sm" (click)="reviewReq(req,'rejected')">✗ Reject</button>
              </div>
            </div>
          </div>

          <!-- Discussion -->
          <div class="detail-card">
            <h2>Discussion Thread</h2>
            <div class="chat-container">
              <div class="chat-messages">
                <div *ngIf="messages.length===0" class="empty-state" style="padding:2rem"><p>No messages yet</p></div>
                <div *ngFor="let m of messages" class="chat-message" [class.own]="m.user?._id === auth.currentUser?.id">
                  <div class="chat-avatar-sm">{{m.user?.name?.charAt(0)}}</div>
                  <div class="chat-bubble">
                    <div class="chat-user">{{m.user?.name}} · {{m.user?.role}}</div>
                    <div class="chat-text">{{m.message}}</div>
                    <div class="chat-time">{{formatDate(m.createdAt)}}</div>
                  </div>
                </div>
              </div>
              <form class="chat-input-area" (ngSubmit)="sendMsg()">
                <input [(ngModel)]="newMsg" name="msg" placeholder="Type your message...">
                <button type="submit" class="btn btn-primary btn-sm">➤</button>
              </form>
            </div>
          </div>
        </div>

        <div class="detail-sidebar">
          <!-- Team Members with Management -->
          <div class="detail-card">
            <h2 style="font-size:1.1rem">Team ({{project.members?.length}}/{{project.maxMembers}})</h2>
            <div *ngFor="let m of project.members" style="display:flex;gap:10px;align-items:center;padding:8px 0;border-bottom:1px solid var(--bg-elevated)">
              <div class="chat-avatar-sm" style="background:var(--gradient-success)">{{m.user?.name?.charAt(0)}}</div>
              <div style="flex:1">
                <div style="font-weight:500;font-size:0.9rem;display:flex;align-items:center;gap:6px">
                  {{m.user?.name}}
                  <span *ngIf="m.isSenior" class="badge badge-purple" style="font-size:0.65rem;padding:1px 6px">★ Senior</span>
                </div>
                <div style="font-size:0.8rem;color:var(--text-muted)">{{m.role}}</div>
              </div>
              <div style="display:flex;gap:4px">
                <button class="btn btn-sm" style="padding:2px 6px;font-size:0.7rem"
                  [ngClass]="{'btn-primary': !m.isSenior, 'btn-secondary': m.isSenior}"
                  (click)="toggleSenior(m)" title="Toggle senior status">★</button>
                <button class="btn btn-danger btn-sm" style="padding:2px 6px;font-size:0.7rem"
                  (click)="removeMember(m)" title="Remove member">✗</button>
              </div>
            </div>
            <p *ngIf="!project.members?.length" style="color:var(--text-muted);font-size:0.9rem">No members yet</p>
          </div>

          <!-- Vacancies -->
          <div class="detail-card">
            <h2 style="font-size:1.1rem">Vacancies</h2>
            <div *ngFor="let v of project.vacancies" style="padding:8px 0;border-bottom:1px solid var(--bg-elevated)">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <span style="font-weight:500;font-size:0.9rem">{{v.role}}</span>
                <span class="badge" [ngClass]="{'badge-green':v.filled,'badge-blue':!v.filled}">{{v.filled ? 'Filled' : 'Open'}}</span>
              </div>
              <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px">
                <span *ngFor="let s of v.requiredSkills" class="skill-tag">{{s}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div *ngIf="loading" class="loading-container"><div class="spinner"></div></div>
  `
})
export class ProjectDetailComponent implements OnInit {
  project: any;
  requests: any[] = [];
  messages: any[] = [];
  loading = true;
  editStatus = '';
  newMsg = '';

  constructor(private api: ApiService, public auth: AuthService, private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.api.getProject(id).subscribe((r: any) => {
      this.project = r.data;
      this.editStatus = this.project.status;
      this.loading = false;
    });
    this.api.getProjectRequests(id).subscribe((r: any) => this.requests = r.data);
    this.api.getMessages(id).subscribe((r: any) => this.messages = r.data);
  }

  updateStatus() {
    this.api.updateProject(this.project._id, { status: this.editStatus }).subscribe((r: any) => this.project = r.data);
  }

  reviewReq(req: any, status: string) {
    this.api.reviewRequest(this.project._id, req._id, { status, reviewComment: req._comment || '' })
      .subscribe(() => { req.status = status;
        this.api.getProject(this.project._id).subscribe((r: any) => this.project = r.data);
      });
  }

  removeMember(m: any) {
    if (!confirm(`Remove ${m.user?.name} from this project?`)) return;
    this.api.removeMember(this.project._id, m.user._id).subscribe((r: any) => {
      this.project.members = r.data.members;
    });
  }

  toggleSenior(m: any) {
    this.api.toggleSenior(this.project._id, m.user._id).subscribe((r: any) => {
      this.project.members = r.data.members;
    });
  }

  sendMsg() {
    if (!this.newMsg.trim()) return;
    this.api.postMessage(this.project._id, this.newMsg).subscribe((r: any) => {
      this.messages.push(r.data);
      this.newMsg = '';
    });
  }

  formatDate(d: string) { return new Date(d).toLocaleString(); }
}
