import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header"><h1>Document Review</h1><p>Verify or reject student-uploaded documents</p></div>
      <div *ngIf="loading" class="loading-container"><div class="spinner"></div></div>
      <div *ngIf="!loading && docs.length === 0" class="empty-state">
        <h3>No pending documents</h3><p>All documents have been reviewed</p>
      </div>
      <div *ngIf="!loading && docs.length > 0" class="detail-card">
        <table class="doc-table">
          <thead><tr><th>Student</th><th>Title</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            <tr *ngFor="let d of docs">
              <td><div style="font-weight:500">{{d.user?.name}}</div><div style="font-size:0.8rem;color:var(--text-muted)">{{d.user?.studentId}} · {{d.user?.department}}</div></td>
              <td>{{d.title}}</td>
              <td><span class="badge badge-blue">{{d.type?.replace('_',' ')}}</span></td>
              <td><span class="badge" [ngClass]="{'badge-yellow':d.verificationStatus==='pending','badge-green':d.verificationStatus==='verified','badge-red':d.verificationStatus==='rejected'}">{{d.verificationStatus}}</span></td>
              <td *ngIf="d.verificationStatus==='pending'">
                <div style="display:flex;gap:6px;align-items:center">
                  <input class="form-input" [(ngModel)]="d._comment" placeholder="Comment..." style="padding:4px 8px;font-size:0.8rem;width:140px">
                  <button class="btn btn-success btn-sm" (click)="verify(d,'verified')">✓</button>
                  <button class="btn btn-danger btn-sm" (click)="verify(d,'rejected')">✗</button>
                </div>
              </td>
              <td *ngIf="d.verificationStatus!=='pending'" style="color:var(--text-muted);font-size:0.85rem">{{d.staffComment || 'No comment'}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class DocumentsComponent implements OnInit {
  docs: any[] = [];
  loading = true;
  constructor(private api: ApiService) {}
  ngOnInit() { this.load(); }
  load() {
    this.loading = true;
    this.api.getPendingDocuments().subscribe((r: any) => { this.docs = r.data; this.loading = false; });
  }
  verify(d: any, status: string) {
    this.api.verifyDocument(d._id, { verificationStatus: status, staffComment: d._comment || '' })
      .subscribe(() => { d.verificationStatus = status; });
  }
}
